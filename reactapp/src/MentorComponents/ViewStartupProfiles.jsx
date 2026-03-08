import React, { useEffect, useState } from "react";
import "./ViewStartupProfiles.css";
import MentorNavbar from "./MentorNavbar";
import api from "../Services/api";

export default function ViewStartupProfiles() {
  const [profiles, setProfiles] = useState([]);   // always array
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  const mentorId = localStorage.getItem("ID") || localStorage.getItem("userId");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await api.get(`/startupProfile/getStartupProfilesByMentorId/${mentorId}`, { headers });
        setProfiles(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [mentorId, token]);

  return (
    <div className="mvp-page">
      <MentorNavbar />

      <div className="mvp-hero">
        <div className="mvp-heroGlow" />
        <div className="mvp-heroInner">
          <h1>
            My <span>Startup Profiles</span>
          </h1>
          <p>Manage your posted opportunities.</p>
        </div>
      </div>

      <div className="mvp-content">
        {loading ? (
          <div className="mvp-state">LOADING PROFILES...</div>
        ) : profiles.length === 0 ? (
          <div className="mvp-state">No profiles found.</div>
        ) : (
          <div className="mvp-grid">
            {profiles.map((p) => (
              <div className="mvp-card" key={p._id}>
                <h3>{p.category}</h3>
                <p>{p.description}</p>
                <div className="mvp-meta">
                  <span>{p.targetIndustry}</span>
                  <span>{p.preferredStage}</span>
                </div>
                <div className="mvp-metrics">
                  <div>Funding: ₹{p.fundingLimit}</div>
                  <div>Equity: {p.avgEquityExpectation}%</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}