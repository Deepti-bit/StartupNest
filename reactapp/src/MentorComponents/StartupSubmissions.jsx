import React, { useEffect, useState } from "react";
import "./StartupSubmissions.css";
import MentorNavbar from "./MentorNavbar";
import api from "../Services/api";

export default function StartupSubmissions() {
  const [subs, setSubs] = useState([]);          // ✅ ALWAYS array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const load = async () => {
    try {
      setLoading(true);
      setError("");


      const res = await api.post(
        "/startupSubmission/getAllStartupSubmissions",
        { page: 1, limit: 25, sortBy: "submissionDate", sortOrder: "desc" },
      );

      // ✅ Safe parsing for multiple backend shapes:
      const items =
        res?.data?.data?.items ||
        res?.data?.items ||
        res?.data?.data ||
        res?.data ||
        [];

      setSubs(Array.isArray(items) ? items : []);
    } catch (e) {
      console.error(e);
      setSubs([]); // ✅ prevent map crash
      setError("Failed to load submissions. Please check backend/API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(
        `/startupSubmission/updateStartupSubmission/${id}`,
        { status },
      );
      setSubs(prev => [...prev,...subs.filter(e => e.id !== id)])
      load();
    } catch (e) {
      console.error(e);
      alert("Status update failed");
    }
  };

  return (
    <div className="msub-page">
      <MentorNavbar />

      <div className="msub-hero">
        <div className="msub-heroGlow" />
        <div className="msub-heroInner">
          <h1>
            Startup <span>Submissions</span>
          </h1>
          <p>Review submitted ideas and update their status.</p>
        </div>
      </div>

      <div className="msub-content">
        {loading ? (
          <div className="msub-state">LOADING SUBMISSIONS...</div>
        ) : error ? (
          <div className="msub-error">{error}</div>
        ) : subs.length === 0 ? (
          <div className="msub-state">No submissions found.</div>
        ) : (
          subs.map((s) => (
            <div className="msub-card" key={s._id}>
              <div className="msub-top">
                <div>
                  <h3>{s.userName || "Unknown User"}</h3>
                  <p>{s.address || "No address"}</p>
                </div>
                <span className="msub-badge">Status: {s.status}</span>
              </div>

              <div className="msub-grid">
                <div>
                  <label>Funding</label>
                  <span>{s.expectedFunding}</span>
                </div>
                <div>
                  <label>Market</label>
                  <span>{s.marketPotential}</span>
                </div>
                <div>
                  <label>Launch</label>
                  <span>{String(s.launchYear || "").slice(0, 10)}</span>
                </div>
                <div>
                  <label>Submitted</label>
                  <span>{String(s.submissionDate || "").slice(0, 10)}</span>
                </div>
              </div>

              <div className="msub-actions">
                <button className="msub-approve" onClick={() => updateStatus(s._id, "ShortListed")}>
                  Approve
                </button>
                <button className="msub-reject" onClick={() => updateStatus(s._id, 'Rejected')}>
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}