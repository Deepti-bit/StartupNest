import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
  const navigate = useNavigate();
  const [glitchActive, setGlitchActive] = useState(false);
  const [count, setCount] = useState(0);
  const [errorId] = useState(
    () => 'ERR-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  );

  /* periodic glitch on "500" */
  useEffect(() => {
    const id = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 320);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  /* animated counter  0 → 500 */
  useEffect(() => {
    let start = 0;
    const end = 500;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="err-page">

      {/* ── Background layers ── */}
      <div className="err-dot-grid" />
      <div className="err-glow err-glow--cyan" />
      <div className="err-glow err-glow--indigo" />

      {/* ── Card ── */}
      <div className="err-card">
        <div className="err-card__shimmer" />
        <div className="err-card__corner err-card__corner--tr" />
        <div className="err-card__corner err-card__corner--bl" />

        <div className="err-card__inner">

          {/* ══ LEFT PANEL ══ */}
          <div className="err-left">

            {/* Illustration */}
            <div className="err-illus">

              {/* outer rings */}
              <div className="err-ring err-ring--1" />
              <div className="err-ring err-ring--2" />
              <div className="err-ring err-ring--3" />

              {/* orbit path dots */}
              <div className="err-orbit err-orbit--1">
                <span className="err-orb err-orb--cyan" />
              </div>
              <div className="err-orbit err-orbit--2">
                <span className="err-orb err-orb--indigo" />
              </div>

              {/* SVG arc */}
              <svg className="err-arc" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="88"
                  fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="88"
                  fill="none" stroke="#06b6d4" strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="553"
                  strokeDashoffset="553"
                  className="err-arc__progress"
                />
              </svg>

              {/* Central server illustration */}
              <div className="err-server">
                <svg className="err-server__svg" viewBox="0 0 96 96" fill="none">
                  {/* server body */}
                  <rect x="16" y="12" width="64" height="20" rx="5"
                    fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"/>
                  <rect x="16" y="38" width="64" height="20" rx="5"
                    fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"/>
                  <rect x="16" y="64" width="64" height="20" rx="5"
                    fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"/>
                  {/* status lights */}
                  <circle cx="72" cy="22" r="4" fill="#dc2626" className="err-light--red"/>
                  <circle cx="72" cy="48" r="4" fill="#f59e0b" className="err-light--amber"/>
                  <circle cx="72" cy="74" r="4" fill="#e2e8f0"/>
                  {/* vent lines */}
                  <line x1="24" y1="20" x2="38" y2="20" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="24" y1="24" x2="34" y2="24" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="24" y1="46" x2="38" y2="46" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="24" y1="50" x2="34" y2="50" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/>
                  {/* X error mark on bottom rack */}
                  <line x1="28" y1="70" x2="38" y2="80" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="38" y1="70" x2="28" y2="80" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                  {/* wifi / signal lost */}
                  <path d="M52 74 Q60 66 68 74" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  <path d="M54.5 77 Q60 71.5 65.5 77" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  <circle cx="60" cy="80" r="1.5" fill="#94a3b8"/>
                </svg>

                {/* floating chip above server */}
                <div className="err-server__chip err-server__chip--top">
                  <span className="err-chip-dot err-chip-dot--red" />
                  OFFLINE
                </div>

                {/* floating chip below */}
                <div className="err-server__chip err-server__chip--bottom">
                  500
                </div>
              </div>

            </div>
          </div>

          {/* ══ RIGHT PANEL ══ */}
          <div className="err-right">

            {/* Badge */}
            <span className="err-badge">
              <span className="err-badge__dot" />
              Internal Server Error
            </span>

            {/* Big counter number */}
            <div className="err-counter-wrap">
              <span className="err-counter">{count}</span>
              {glitchActive && <span className="err-counter err-counter--glitch">{count}</span>}
            </div>

            {/* Headline */}
            <div className="err-title">
              <h1>
                The server hit a<br />
                <span className="err-title__hl">critical fault.</span>
              </h1>
            </div>

            {/* Description */}
            <div className="err-desc">
              <p>
                A fault has been logged on our end. Your session and data are
                safe — this is a temporary disruption. Please return to the
                dashboard or go back to continue.
              </p>
            </div>

            {/* Actions */}
            <div className="err-actions">
              <button className="err-btn err-btn--primary" onClick={() => navigate('/')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Return to Dashboard
              </button>
              <button className="err-btn err-btn--ghost" onClick={() => navigate(-1)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Go Back
              </button>
            </div>

            {/* Status row */}
            <div className="err-status-row">
              {[
                { label: 'Code',      value: '500',          accent: '#dc2626', bg: '#fef2f2', br: '#fecaca' },
                { label: 'Status',    value: 'Degraded',     accent: '#f59e0b', bg: '#fffbeb', br: '#fde68a' },
                { label: 'Ref',       value: errorId,        accent: '#0891b2', bg: '#f0fdff', br: '#a5f3fc' },
              ].map(({ label, value, accent, bg, br }, i) => (
                <div key={label} className="err-stat"
                  style={{ '--i': i, background: bg, borderColor: br }}>
                  <span className="err-stat__label">{label}</span>
                  <span className="err-stat__value" style={{ color: accent }}>{value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="err-footer">
          <div className="err-footer__brand">
            <div className="err-footer__logo">S</div>
            <span className="err-footer__name">StartupBridge</span>
          </div>
          <div className="err-footer__meta">
            <span className="err-footer__pulse" />
            <span className="err-footer__text">SYSTEM DEGRADED</span>
            <span className="err-footer__sep" />
            <span className="err-footer__text">{errorId}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ErrorPage;