// src/components/LandingPage.jsx
import { useState } from "react";

const GRID_LINES = Array.from({ length: 12 }, (_, i) => i);

export default function LandingPage({ onStart }) {
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#040A14",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>

      {/* ── Background grid ─────────────────────────────────────── */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {GRID_LINES.map((i) => (
          <line key={`v${i}`} x1={`${(i / 12) * 100}%`} y1="0" x2={`${(i / 12) * 100}%`} y2="100%" stroke="#22D3EE" strokeWidth="0.5" />
        ))}
        {GRID_LINES.map((i) => (
          <line key={`h${i}`} x1="0" y1={`${(i / 12) * 100}%`} x2="100%" y2={`${(i / 12) * 100}%`} stroke="#22D3EE" strokeWidth="0.5" />
        ))}
      </svg>

      {/* ── Radial glow behind center ───────────────────────────── */}
      <div style={{
        position: "absolute",
        width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, #0A2A4A 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── Corner brackets ─────────────────────────────────────── */}
      {[
        { top: 24, left: 24, rotate: "0deg" },
        { top: 24, right: 24, rotate: "90deg" },
        { bottom: 24, right: 24, rotate: "180deg" },
        { bottom: 24, left: 24, rotate: "270deg" },
      ].map((pos, i) => (
        <svg key={i} width="28" height="28" style={{ position: "absolute", opacity: 0.3, ...pos }}>
          <path
            d={`M0,20 L0,0 L20,0`}
            fill="none" stroke="#22D3EE" strokeWidth="1.5"
            transform={`rotate(${pos.rotate}, 14, 14)`}
          />
        </svg>
      ))}

      {/* ── Top system label ────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 28, left: 0, right: 0,
        display: "flex", justifyContent: "center",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "5px 16px",
          border: "1px solid #1A2744",
          borderRadius: 4,
          background: "#060C18",
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "#22C55E",
            boxShadow: "0 0 6px #22C55E",
            animation: "blink 2s ease-in-out infinite",
          }} />
          <span style={{
            fontSize: 9, letterSpacing: "0.2em",
            color: "#334155", textTransform: "uppercase",
            fontFamily: "'DM Mono', monospace", fontWeight: 600,
          }}>
            SYSTEM ONLINE · KHED MUNICIPAL AUTHORITY
          </span>
        </div>
      </div>

      {/* ── Center panel ────────────────────────────────────────── */}
      <div style={{
        position: "relative", zIndex: 1,
        textAlign: "center",
        padding: "0 24px",
        maxWidth: 620,
        animation: "fadeUp 0.6s ease",
      }}>

        {/* Hex icon */}
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 64, height: 64,
          borderRadius: 16,
          border: "1px solid #1A3A5C",
          background: "linear-gradient(135deg, #060C18 0%, #0A1830 100%)",
          fontSize: 26,
          marginBottom: 28,
          boxShadow: "0 0 40px #0A2A4A",
        }}>
          ⬡
        </div>

        {/* System tag */}
        <div style={{
          display: "inline-block",
          padding: "4px 14px",
          border: "1px solid #22D3EE30",
          borderRadius: 4,
          background: "#22D3EE08",
          marginBottom: 18,
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
            color: "#22D3EE", textTransform: "uppercase",
            fontFamily: "'DM Mono', monospace",
          }}>
            CIVICAI RESPONSE SYSTEM
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 38,
          fontWeight: 700,
          color: "#F1F5F9",
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
          margin: "0 0 14px",
        }}>
          AI-Powered Urban Risk<br />
          <span style={{ color: "#22D3EE" }}>Intelligence Platform</span>
        </h1>

        {/* Description */}
        <p style={{
          fontSize: 14,
          color: "#475569",
          lineHeight: 1.75,
          margin: "0 0 44px",
          maxWidth: 480,
          marginLeft: "auto", marginRight: "auto",
        }}>
          Predict urban incidents before they escalate, receive AI-driven 
          response recommendations, and manage city emergencies with confidence.
        </p>

        {/* CTA button */}
        <button
          onClick={onStart}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            padding: "15px 44px",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: btnHover ? "#040A14" : "#22D3EE",
            background: btnHover
              ? "linear-gradient(135deg, #22D3EE 0%, #0EA5E9 100%)"
              : "transparent",
            border: "1px solid #22D3EE",
            borderRadius: 8,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.22s ease",
            boxShadow: btnHover ? "0 0 30px #22D3EE40" : "0 0 12px #22D3EE15",
            textTransform: "uppercase",
          }}
        >
          {btnHover ? "▶  START ANALYSIS" : "Start Analysis"}
        </button>

        {/* Bottom hint */}
        <p style={{
          marginTop: 20, fontSize: 10, color: "#1E3A5F",
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          3 scenarios available · Gemini AI Engine · v3.0
        </p>
      </div>

      {/* ── Bottom status strip ──────────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 24, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 32,
      }}>
        {[
          { label: "AI ENGINE", value: "GEMINI 1.5 FLASH", color: "#22C55E" },
          { label: "SCENARIOS",  value: "3 LOADED",          color: "#22D3EE" },
          { label: "STATUS",     value: "OPERATIONAL",       color: "#22C55E" },
          { label: "PLATFORM",   value: "CIVICAI v3.0",      color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 8, letterSpacing: "0.16em", color: "#1E3A5F", textTransform: "uppercase" }}>
              {s.label}
            </p>
            <p style={{
              margin: "3px 0 0", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.1em", color: s.color,
              fontFamily: "'DM Mono', monospace",
            }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
