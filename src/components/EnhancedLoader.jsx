/**
 * EnhancedLoader — AI Analysis Loading component (Prompt 2).
 * Replaces the simple spinner with a full-featured loading experience:
 *  • Rotating status messages every 500ms
 *  • Cycling progress bar
 *  • Counting stats (events analyzed, data points, confidence %)
 *  • Fake terminal output
 *  • CivicAI dark aesthetic — no external deps
 */
import { useState, useEffect, useRef } from "react";

const STATUS_MESSAGES = [
  "Connecting to Gemini AI engine...",
  "Fetching historical incident data...",
  "Analyzing weather patterns...",
  "Simulating cascade effects...",
  "Running Monte Carlo risk models...",
  "Generating causal event graph...",
  "Calculating impact projections...",
  "Preparing response recommendations...",
  "Cross-referencing IoT sensor feeds...",
  "Validating scenario parameters...",
];

// Terminal lines keyed per scenario
const TERMINAL_LINES = {
  traffic: [
    "> Loading scenario: Traffic_v3_Khed...",
    "> Fetching IoT sensor data...          [OK]",
    "> Retrieving weather API...            [OK]",
    "> Analyzing traffic patterns...        [DONE]",
    "> Running cascade model...             [OK]",
    "> Generating recommendations...        [PROCESSING]",
  ],
  factory: [
    "> Loading scenario: Factory_Accident_Khed...",
    "> Fetching HazMat chemical database... [OK]",
    "> Retrieving wind / weather data...    [OK]",
    "> Modeling plume dispersion...         [DONE]",
    "> Calculating evacuation radius...     [OK]",
    "> Generating emergency response...     [PROCESSING]",
  ],
  flood: [
    "> Loading scenario: Flood_Risk_Khed...",
    "> Fetching Bhima River gauge data...   [OK]",
    "> Retrieving rainfall forecast API...  [OK]",
    "> Simulating dam release cascade...    [DONE]",
    "> Mapping flood inundation zones...    [OK]",
    "> Generating evacuation advisories...  [PROCESSING]",
  ],
};

const DEFAULT_TERMINAL = [
  "> Loading scenario data...",
  "> Connecting to Gemini AI...           [OK]",
  "> Fetching analysis parameters...      [OK]",
  "> Running risk models...               [DONE]",
  "> Calculating cascade effects...       [OK]",
  "> Generating report...                 [PROCESSING]",
];

// ── Animated counter hook ─────────────────────────────────────────────────
function useCounter(target, duration = 2200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

// ── Circular progress ─────────────────────────────────────────────────────
function CircleProgress({ pct, color, size = 44, stroke = 3 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#0F1E35" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.4s ease" }}
      />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function EnhancedLoader({ color = "#22D3EE", scenarioId }) {
  const [msgIdx,     setMsgIdx]     = useState(0);
  const [progress,   setProgress]   = useState(0);
  const [termLines,  setTermLines]  = useState([]);
  const [confPct,    setConfPct]    = useState(0);

  const eventsCount   = useCounter(47,   2000);
  const dataPoints    = useCounter(2400, 2400);
  const termRef       = useRef(null);

  const terminalScript = TERMINAL_LINES[scenarioId] || DEFAULT_TERMINAL;
  const accentColor    = color;

  // ── Rotating status messages ─────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 520);
    return () => clearInterval(id);
  }, []);

  // ── Cycling progress bar (0→100, reset, repeat) ──────────────────────
  useEffect(() => {
    let pct = 0;
    const id = setInterval(() => {
      pct = (pct + 1.4) % 101;
      setProgress(Math.min(pct, 100));
    }, 40);
    return () => clearInterval(id);
  }, []);

  // ── Confidence calibration counter (cycles 60→92) ────────────────────
  useEffect(() => {
    let v = 60;
    const id = setInterval(() => {
      v = v >= 92 ? 60 : v + 1;
      setConfPct(v);
    }, 120);
    return () => clearInterval(id);
  }, []);

  // ── Terminal lines appearing one by one ──────────────────────────────
  useEffect(() => {
    setTermLines([]);
    let i = 0;
    const id = setInterval(() => {
      if (i < terminalScript.length) {
        setTermLines((prev) => [...prev, terminalScript[i]]);
        i++;
      }
    }, 480);
    return () => clearInterval(id);
  }, [scenarioId]);

  // Auto-scroll terminal
  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [termLines]);

  return (
    <>
      <style>{`
        @keyframes elRing {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes elSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes elBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        @keyframes elFadeIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes elPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px currentColor; }
          50%       { opacity: 0.5; box-shadow: none; }
        }
        .el-term-line { animation: elFadeIn 0.3s ease; }
        .el-blink     { animation: elBlink 1.2s ease-in-out infinite; }
      `}</style>

      <div style={{
        background: "#060C18",
        border: "1px solid #152035",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 22,
      }}>
        {/* ── Status badge header ──────────────────────────────── */}
        <div style={{
          padding: "12px 22px",
          borderBottom: "1px solid #152035",
          display: "flex", alignItems: "center", gap: 10,
          background: `linear-gradient(90deg, ${accentColor}0A, transparent)`,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: accentColor,
            boxShadow: `0 0 8px ${accentColor}`,
            animation: "elBlink 1s ease-in-out infinite",
          }} />
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
            color: accentColor, textTransform: "uppercase",
            fontFamily: "'DM Mono', monospace",
          }}>
            AI ENGINE: GEMINI 1.5 FLASH · PROCESSING
          </span>
          <span style={{
            marginLeft: "auto",
            padding: "2px 8px",
            borderRadius: 3,
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            fontSize: 8, fontWeight: 700,
            color: accentColor, letterSpacing: "0.1em",
            fontFamily: "'DM Mono', monospace",
          }}>
            LIVE
          </span>
        </div>

        <div style={{ padding: "22px 22px 18px" }}>
          {/* ── Top row: spinner + status + progress ─────────────── */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 22, marginBottom: 22 }}>
            {/* Animated spinner with pulse rings */}
            <div style={{ position: "relative", flexShrink: 0, width: 64, height: 64 }}>
              {/* Pulse rings */}
              {[0, 1].map((ring) => (
                <span key={ring} style={{
                  position: "absolute",
                  inset: -(ring * 10),
                  borderRadius: "50%",
                  border: `1px solid ${accentColor}`,
                  animation: `elRing 2s ease-out ${ring * 0.6}s infinite`,
                  pointerEvents: "none",
                }} />
              ))}
              {/* Outer ring */}
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                border: `2px solid ${accentColor}22`,
                borderTop: `2px solid ${accentColor}`,
                animation: "elSpin 0.85s linear infinite",
              }} />
              {/* Inner icon */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>
                ⬡
              </div>
            </div>

            {/* Status message + progress bar */}
            <div style={{ flex: 1 }}>
              <p style={{
                margin: "0 0 8px",
                fontSize: 13, fontWeight: 600, color: "#CBD5E1",
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.02em",
                minHeight: 20,
              }}>
                {STATUS_MESSAGES[msgIdx]}
              </p>
              {/* Progress bar */}
              <div style={{
                height: 4, borderRadius: 3,
                background: "#0F1E35",
                overflow: "hidden", marginBottom: 8,
              }}>
                <div style={{
                  height: "100%", borderRadius: 3,
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
                  boxShadow: `0 0 8px ${accentColor}60`,
                  transition: "width 0.04s linear",
                }} />
              </div>
              <p style={{
                margin: 0, fontSize: 9, color: "#1E3A5F",
                letterSpacing: "0.1em", textTransform: "uppercase",
                fontFamily: "'DM Mono', monospace",
              }}>
                KHED MUNICIPAL AUTHORITY · CIVICAI v3.0
              </p>
            </div>
          </div>

          {/* ── Stats cards ──────────────────────────────────────── */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12, marginBottom: 18,
          }}>
            {/* Events analyzed */}
            <div style={{
              background: "#040A14",
              border: "1px solid #0F1E35",
              borderRadius: 8, padding: "12px 14px",
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 9, color: "#2D4A6B", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Events Analyzed
              </p>
              <p style={{
                margin: 0, fontSize: 22, fontWeight: 700,
                color: accentColor, fontFamily: "'DM Mono', monospace",
              }}>
                {eventsCount}
              </p>
            </div>

            {/* Data points processed */}
            <div style={{
              background: "#040A14",
              border: "1px solid #0F1E35",
              borderRadius: 8, padding: "12px 14px",
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 9, color: "#2D4A6B", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Data Points
              </p>
              <p style={{
                margin: 0, fontSize: 22, fontWeight: 700,
                color: "#22C55E", fontFamily: "'DM Mono', monospace",
              }}>
                {dataPoints.toLocaleString()}
              </p>
            </div>

            {/* Confidence calibration */}
            <div style={{
              background: "#040A14",
              border: "1px solid #0F1E35",
              borderRadius: 8, padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 9, color: "#2D4A6B", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Confidence
                </p>
                <p style={{
                  margin: 0, fontSize: 18, fontWeight: 700,
                  color: "#F59E0B", fontFamily: "'DM Mono', monospace",
                }}>
                  {confPct}%
                </p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <CircleProgress pct={confPct} color="#F59E0B" />
              </div>
            </div>
          </div>

          {/* ── Terminal output ───────────────────────────────────── */}
          <div style={{
            background: "#020609",
            border: "1px solid #0A1628",
            borderRadius: 8,
            overflow: "hidden",
          }}>
            {/* Terminal header */}
            <div style={{
              padding: "7px 14px",
              borderBottom: "1px solid #0A1628",
              display: "flex", alignItems: "center", gap: 7,
              background: "#040A14",
            }}>
              {["#EF4444", "#F59E0B", "#22C55E"].map((c) => (
                <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }} />
              ))}
              <span style={{
                marginLeft: 6, fontSize: 9, color: "#1E3A5F",
                letterSpacing: "0.12em", fontFamily: "'DM Mono', monospace",
              }}>
                civicai-terminal — bash
              </span>
            </div>
            {/* Terminal lines */}
            <div
              ref={termRef}
              style={{
                padding: "12px 16px",
                height: 110, overflowY: "auto",
                fontFamily: "'DM Mono', monospace",
                fontSize: 10.5, lineHeight: 1.75,
              }}
            >
              {termLines.map((line, i) => {
                const isOk   = line.includes("[OK]");
                const isDone = line.includes("[DONE]");
                const isProc = line.includes("[PROCESSING]");
                const color  = isOk ? "#22C55E" : isDone ? accentColor : isProc ? "#F59E0B" : "#334155";
                return (
                  <p key={i} className="el-term-line" style={{ margin: 0, color }}>
                    {line}
                  </p>
                );
              })}
              {/* Blinking cursor */}
              <span className="el-blink" style={{
                display: "inline-block", width: 7, height: 13,
                background: accentColor, verticalAlign: "text-bottom", marginLeft: 2,
              }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
