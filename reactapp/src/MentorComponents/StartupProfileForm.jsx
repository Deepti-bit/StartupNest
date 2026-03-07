import React, { useState } from "react";
import "./StartupProfileForm.css";
import MentorNavbar from "./MentorNavbar";
import api from "../Services/api";

export default function StartupProfileForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category: "",
    description: "",
    fundingLimit: "",
    avgEquityExpectation: "",
    targetIndustry: "",
    preferredStage: "idea",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    // ✅ basic validation (prevents backend crash)
    if (
      !form.category.trim() ||
      !form.description.trim() ||
      !form.targetIndustry.trim()
    ) {
      alert("Category, Description and Target Industry are required");
      return;
    }

    try {
      setLoading(true);

      // ✅ CORRECT ENDPOINT (this fixes 500)
      await api.post(
        "/startupProfiles",
        {
          category: form.category.trim(),
          description: form.description.trim(),
          fundingLimit: Number(form.fundingLimit),
          avgEquityExpectation: Number(form.avgEquityExpectation),
          targetIndustry: form.targetIndustry.trim(),
          preferredStage: form.preferredStage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Startup Profile created successfully ✅");

      // reset form
      setForm({
        category: "",
        description: "",
        fundingLimit: "",
        avgEquityExpectation: "",
        targetIndustry: "",
        preferredStage: "idea",
      });
    } catch (err) {
      console.error("Add profile failed:", err?.response?.data || err);
      alert(
        err?.response?.data?.message ||
        "Internal Server Error (check backend logs)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mpf-page">
      <MentorNavbar />

      <section className="mpf-hero">
        <div className="mpf-heroGlow" />
        <div className="mpf-heroInner">
          <h1>
            Add <span>Startup Profile</span>
          </h1>
          <p>Create a mentoring or funding opportunity</p>
        </div>
      </section>

      <main className="mpf-content">
        <form className="mpf-card" onSubmit={submit}>
          <label>Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="FinTech"
          />

          <label>Description</label>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your mentoring opportunity"
          />

          <div className="mpf-grid2">
            <div>
              <label>Funding Limit</label>
              <input
                type="number"
                name="fundingLimit"
                value={form.fundingLimit}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div>
              <label>Avg Equity Expectation (%)</label>
              <input
                type="number"
                name="avgEquityExpectation"
                value={form.avgEquityExpectation}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <label>Target Industry</label>
          <input
            name="targetIndustry"
            value={form.targetIndustry}
            onChange={handleChange}
            placeholder="Finance"
          />

          <label>Preferred Stage</label>
          <select
            name="preferredStage"
            value={form.preferredStage}
            onChange={handleChange}
          >
            <option value="idea">idea</option>
            <option value="MVP">MVP</option>
            <option value="pre-revenue">pre-revenue</option>
            <option value="scaling">scaling</option>
            <option value="established">established</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </main>
    </div>
  );
}