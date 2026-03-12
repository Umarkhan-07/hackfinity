import { useState, useCallback } from "react";
import { SCENARIOS } from "./scenarios";
import { analyzeEvents, simulateScenario } from "./services/aiAnalyzer";
import LandingPage from "./components/LandingPage";
import ScenarioSelector from "./components/ScenarioSelector";
import EventTable from "./components/EventTable";
import CausalGraph from "./components/CausalGraph";
import AnalysisPanel from "./components/AnalysisPanel";
import ScenarioSimulator from "./components/ScenarioSimulator";
import SimulationResult from "./components/SimulationResult";
import ImpactChart from "./components/ImpactChart";
import EnhancedLoader from "./components/EnhancedLoader";

// ── Global styles + keyframes ─────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;0,600&family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background: #040A14;
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
    color: #E2E8F0;
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #070E1C; }
  ::-webkit-scrollbar-thumb { background: #1A2744; border-radius: 3px; }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.25; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes nodeLoad {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes edgeLoad {
    from { stroke-dashoffset: 300; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes pulseRingG {
    0%   { opacity: 0.7; }
    100% { opacity: 0;   }
  }
  .graph-pulse { animation: pulseRingG 1.5s ease-out infinite; }
`;

// ── Status badge ──────────────────────────────────────────────────────────
function StatusBadge({ label, value, dot, dotColor, pulse }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "5px 13px",
      background: "#060C18",
      border: "1px solid #152035",
      borderRadius: 5,
    }}>
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: dotColor || "#22C55E",
          boxShadow: `0 0 7px ${dotColor || "#22C55E"}`,
          animation: pulse ? "pulse 1.5s ease-in-out infinite" : "blink 2.5s ease-in-out infinite",
          flexShrink: 0,
        }} />
      )}
      <span style={{
        fontSize: 9, color: "#2D4A6B",
        letterSpacing: "0.12em", textTransform: "uppercase",
      }}>
        {label}:
      </span>
      <span style={{
        fontSize: 9, fontWeight: 700,
        color: dot ? (dotColor || "#22C55E") : "#475569",
        letterSpacing: "0.08em",
        fontFamily: "'DM Mono', monospace",
      }}>
        {value}
      </span>
    </div>
  );
}

// ── Three-card insight bar ────────────────────────────────────────────────
function InsightBar({ scenario, aiResult }) {
  const RISK_MAP = {
    "Frequent Event":        { label: "Medium",   color: "#F59E0B" },
    "Rare Event":            { label: "Critical", color: "#EF4444" },
    "Predictive Risk Event": { label: "High",     color: "#F97316" },
  };
  const risk = RISK_MAP[scenario.category] || { label: "—", color: "#475569" };

  const cards = [
    {
      icon: "◈",
      label: "Event Category",
      value: scenario.category,
      color: scenario.color,
    },
    {
      icon: "◇",
      label: "Primary Root Cause",
      value: aiResult
        ? (() => {
            // Each category schema uses a different primary text field
            const text =
              aiResult.rootCause          ||
              aiResult.futureRiskForecast ||
              (aiResult.impactChains?.[0]) ||
              "Analysis complete";
            const sentence = text.split(".")[0];
            return sentence.length > 80 ? sentence.slice(0, 78) + "…" : sentence + ".";
          })()
        : "Awaiting AI analysis…",
      color: scenario.color,
      muted: !aiResult,
    },
    {
      icon: "⬡",
      label: "Risk Level",
      value: risk.label,
      color: risk.color,
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 14,
      marginBottom: 26,
      animation: "fadeUp 0.35s ease",
    }}>
      {cards.map((c) => (
        <div key={c.label} style={{
          background: "#070E1C",
          border: `1px solid ${c.color}2E`,
          borderRadius: 10,
          padding: "15px 18px",
          boxShadow: `inset 0 0 24px ${c.color}06`,
          transition: "border-color 0.3s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
            <span style={{ fontSize: 11, color: c.color, opacity: 0.6 }}>{c.icon}</span>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
              color: "#2D4A6B", textTransform: "uppercase",
            }}>
              {c.label}
            </span>
          </div>
          <p style={{
            margin: 0, fontSize: 13.5, fontWeight: 700,
            color: c.muted ? "#2D4A6B" : c.color,
            lineHeight: 1.4,
            fontStyle: c.muted ? "italic" : "normal",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Standby — scenario select prompt inside dashboard ────────────────────
function StandbyPanel({ scenarios, onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "20px 32px 40px",
      animation: "fadeUp 0.4s ease",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 13,
        border: "1px solid #1A2744",
        background: "#060C18",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, marginBottom: 22,
        boxShadow: "0 0 28px #060C18",
      }}>
        ⬡
      </div>
      <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "#1E3A5F", textTransform: "uppercase", marginBottom: 7 }}>
        SYSTEM READY
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#CBD5E1", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
        Select a Scenario to Begin
      </h2>
      <p style={{ fontSize: 13, color: "#2D4A6B", margin: "0 0 38px", textAlign: "center", maxWidth: 340, lineHeight: 1.65 }}>
        Choose an urban event scenario. Gemini AI will automatically analyze events, identify root causes, and generate a full response recommendation.
      </p>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        {scenarios.map((sc) => {
          const isHov = hovered === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onSelect(sc.id)}
              onMouseEnter={() => setHovered(sc.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: "18px 26px", minWidth: 186,
                borderRadius: 10, textAlign: "left",
                border: `1px solid ${isHov ? sc.color : sc.color + "30"}`,
                background: isHov ? `${sc.color}15` : `${sc.color}07`,
                color: isHov ? sc.color : sc.color + "80",
                fontFamily: "inherit", fontSize: 14, fontWeight: 600,
                cursor: "pointer", letterSpacing: "0.01em",
                transition: "all 0.2s ease", outline: "none",
                boxShadow: isHov ? `0 0 22px ${sc.color}22` : "none",
              }}
            >
              <span style={{
                display: "block", fontSize: 9, letterSpacing: "0.14em",
                color: isHov ? sc.color : sc.color + "55",
                textTransform: "uppercase", marginBottom: 5, fontWeight: 700,
              }}>
                {sc.category}
              </span>
              {sc.label}
              <span style={{ display: "block", fontSize: 10, marginTop: 4, letterSpacing: "0.04em", color: isHov ? sc.color + "70" : "#1A2744" }}>
                {sc.id === "traffic" && "5 events · Khed Municipality"}
                {sc.id === "factory" && "5 events · Chemical Plant Unit-3"}
                {sc.id === "flood"   && "5 events · Bhima River Basin"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Loading state ─────────────────────────────────────────────────────────
function LoadingState({ color }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "56px 0",
    }}>
      <div style={{
        width: 38, height: 38,
        border: `2px solid ${color}18`,
        borderTop: `2px solid ${color}`,
        borderRadius: "50%",
        animation: "spin 0.75s linear infinite",
        marginBottom: 18,
      }} />
      <p style={{ fontSize: 11, letterSpacing: "0.18em", color: "#2D4A6B", textTransform: "uppercase" }}>
        GEMINI ANALYSING…
      </p>
      <p style={{ fontSize: 11, color: "#1A2744", marginTop: 5 }}>
        Sending scenario events to AI engine
      </p>
    </div>
  );
}

// ── Panel wrapper ─────────────────────────────────────────────────────────
function Panel({ label, accent, right, children }) {
  return (
    <div style={{
      background: "#060C18",
      border: "1px solid #152035",
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 22,
      animation: "fadeUp 0.35s ease",
    }}>
      <div style={{
        padding: "12px 22px",
        borderBottom: "1px solid #152035",
        display: "flex", alignItems: "center", gap: 10,
        background: "#050A15",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, boxShadow: `0 0 6px ${accent}` }} />
        <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "#2D4A6B", textTransform: "uppercase", fontWeight: 700 }}>
          {label}
        </span>
        {right && <span style={{ marginLeft: "auto", fontSize: 9, color: "#1A2744", letterSpacing: "0.1em" }}>{right}</span>}
      </div>
      <div style={{ padding: "20px 22px" }}>
        {children}
      </div>
    </div>
  );
}

// ── Section heading for AI Analysis Report ────────────────────────────────
function ReportHeader({ color, isLive }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
      animation: "slideIn 0.3s ease",
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        background: color, boxShadow: `0 0 9px ${color}`,
        animation: "pulse 2s ease-in-out infinite",
      }} />
      <h2 style={{
        margin: 0, fontSize: 11, fontWeight: 700,
        letterSpacing: "0.2em", color: "#334155", textTransform: "uppercase",
      }}>
        AI Analysis Report
      </h2>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "3px 10px", borderRadius: 4,
        border: "1px solid #22D3EE20", background: "#22D3EE08",
        fontSize: 9, color: "#22D3EE", letterSpacing: "0.1em", fontWeight: 700,
      }}>
        ◉ {isLive ? "GEMINI ACTIVE" : "DEMO MODE"}
      </span>
      <span style={{ flex: 1, height: 1, background: "#0F1E35" }} />
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [view,     setView]     = useState("landing"); // "landing" | "dashboard"
  const [selected, setSelected] = useState(null);
  const [phase,    setPhase]    = useState("idle");    // idle | loading | done | error
  const [aiResult, setAiResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  const scenario = SCENARIOS.find((s) => s.id === selected);
  const color    = scenario?.color ?? "#22D3EE";

  // ── Scenario selection + AI call ────────────────────────────────────────
  const handleSelect = useCallback(async (id) => {
    const sc = SCENARIOS.find((s) => s.id === id);
    if (!sc) return;
    setSelected(id);
    setAiResult(null);
    setErrorMsg("");
    setPhase("loading");
    try {
      // Use graphData events (id/name/detail format) for AI — they match the prompt structure
      const eventsForAI = sc.graphData?.events || sc.data;
      const result = await analyzeEvents(eventsForAI, sc.category, sc.id);
      setAiResult(result);
      setPhase("done");
    } catch (e) {
      setErrorMsg(e.message);
      setPhase("error");
    }
  }, []);

  // ── Simulation handler ─────────────────────────────────────────────────
  const handleSimulate = useCallback(async ({ eventType, condition }) => {
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const result = await simulateScenario(eventType, condition);
      setSimulationResult(result);
    } catch (e) {
      console.error("Simulation error:", e);
    } finally {
      setIsSimulating(false);
    }
  }, []);

  const handleClearSimulation = useCallback(() => {
    setSimulationResult(null);
  }, []);

  // ── System status for header ─────────────────────────────────────────────
  const sysStatus =
    phase === "loading" ? { label: "PROCESSING", color: "#F59E0B", pulse: true } :
    phase === "done"    ? { label: "OPERATIONAL", color: "#22C55E" } :
    phase === "error"   ? { label: "ERROR",        color: "#EF4444" } :
    { label: "STANDBY", color: "#475569" };

  // ── Landing page ─────────────────────────────────────────────────────────
  if (view === "landing") {
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <LandingPage onStart={() => setView("dashboard")} />
      </>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#040A14", color: "#E2E8F0" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <header style={{
        borderBottom: "1px solid #0D1E35",
        padding: "0 32px",
        height: 62,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 24,
        background: "#040A14",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 33, height: 33, borderRadius: 8,
            border: "1px solid #1A2744", background: "#060C18",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "#22D3EE", flexShrink: 0,
          }}>
            ⬡
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 9, letterSpacing: "0.18em", color: "#1A3050", textTransform: "uppercase", fontWeight: 700 }}>
              CivicAI Response System
            </p>
            <h1 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#E2E8F0", letterSpacing: "-0.01em" }}>
              Urban Risk Intelligence Platform
            </h1>
          </div>
        </div>

        {/* Right — status badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <StatusBadge
            label="SYSTEM STATUS"
            value={sysStatus.label}
            dot dotColor={sysStatus.color}
            pulse={sysStatus.pulse}
          />
          <StatusBadge
            label="AI ENGINE"
            value={phase === "loading" ? "PROCESSING" : "GEMINI ACTIVE"}
            dot
            dotColor={phase === "loading" ? "#F59E0B" : "#22C55E"}
            pulse={phase === "loading"}
          />
          <StatusBadge label="DATA SOURCE" value="SCENARIO SIMULATION" />
        </div>
      </header>

      {/* ── MAIN ────────────────────────────────────────────────────── */}
      <main style={{ padding: "16px 32px", maxWidth: 1160, margin: "0 auto" }}>

        {/* Scenario selector strip (shown once dashboard is active) */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          marginBottom: 16, flexWrap: "wrap",
        }}>
          {/* Back button - shows when a scenario is selected */}
          {selected && (
            <button
              onClick={() => {
                setSelected(null);
                setPhase("idle");
                setAiResult(null);
              }}
              style={{
                padding: "6px 14px", borderRadius: 5,
                border: "1px solid #1A2744", background: "transparent",
                color: "#334155", fontSize: 10, fontFamily: "inherit",
                cursor: "pointer", letterSpacing: "0.08em",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#22D3EE40"; e.currentTarget.style.color = "#22D3EE"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1A2744"; e.currentTarget.style.color = "#334155"; }}
            >
              ← SELECT SCENARIO
            </button>
          )}
          
          <span style={{ fontSize: 9, color: "#1A3050", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
            SCENARIO
          </span>
          <ScenarioSelector
            scenarios={SCENARIOS}
            selected={selected}
            onSelect={handleSelect}
            disabled={phase === "loading"}
          />
          {/* Back to landing */}
          <button
            onClick={() => setView("landing")}
            style={{
              marginLeft: "auto",
              padding: "6px 14px", borderRadius: 5,
              border: "1px solid #1A2744", background: "transparent",
              color: "#334155", fontSize: 10, fontFamily: "inherit",
              cursor: "pointer", letterSpacing: "0.08em",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#22D3EE40"; e.currentTarget.style.color = "#22D3EE"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1A2744"; e.currentTarget.style.color = "#334155"; }}
          >
            ← LANDING
          </button>
        </div>

        {/* ── SCENARIO SIMULATOR ───────────────────────────────────────────── */}
        {/* Only show on idle page, side by side with scenario selection */}
        {phase === "idle" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Left: Scenario Selection */}
            <StandbyPanel scenarios={SCENARIOS} onSelect={handleSelect} />
            
            {/* Right: Scenario Simulator */}
            <div>
              <ScenarioSimulator 
                onSimulate={handleSimulate} 
                isSimulating={isSimulating} 
              />
              
              {/* Simulation Result */}
              {simulationResult && (
                <SimulationResult 
                  result={simulationResult} 
                  onClear={handleClearSimulation}
                />
              )}
            </div>
          </div>
        )}

        {/* ── IDLE ──────────────────────────────────────────────────── */}
        {/* Note: Simulator is shown side-by-side with scenario selection above */}

        {/* ── LOADING ───────────────────────────────────────────────── */}
        {phase === "loading" && scenario && (
          <>
            <InsightBar scenario={scenario} aiResult={null} />
            <Panel label="Scenario Events" accent={color} right={`${scenario.data.length} RECORDS`}>
              <EventTable events={scenario.data} accentColor={color} />
            </Panel>
            <Panel label="Causal Event Graph" accent={color}>
              <CausalGraph graphData={scenario.graphData} accentColor={color} />
            </Panel>
            <EnhancedLoader color={color} scenarioId={selected} />
          </>
        )}

        {/* ── ERROR ─────────────────────────────────────────────────── */}
        {phase === "error" && scenario && (
          <>
            <InsightBar scenario={scenario} aiResult={null} />
            <div style={{
              background: "#0D0405", border: "1px solid #7F1D1D",
              borderRadius: 10, padding: "18px 22px",
              color: "#FCA5A5", fontSize: 13, lineHeight: 1.65,
            }}>
              <strong>Analysis Error:</strong> {errorMsg}
            </div>
          </>
        )}

        {/* ── DONE ──────────────────────────────────────────────────── */}
        {scenario && phase === "done" && aiResult && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>

            {/* 1 · Insight bar */}
            <InsightBar scenario={scenario} aiResult={aiResult} />

            {/* 2 · Scenario Events Table */}
            <Panel label="Scenario Events" accent={color} right={`${scenario.data.length} RECORDS`}>
              <EventTable events={scenario.data} accentColor={color} />
            </Panel>

            {/* 3 · Causal Graph + Impact Chart — split layout (Prompts 1, 3, 4) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22, animation: "fadeUp 0.4s ease" }}>

              {/* Left: Causal Event Graph */}
              <div style={{
                background: "#060C18",
                border: "1px solid #152035",
                borderRadius: 12,
                overflow: "hidden",
              }}>
                <div style={{
                  padding: "12px 22px",
                  borderBottom: "1px solid #152035",
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#050A15",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
                  <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "#2D4A6B", textTransform: "uppercase", fontWeight: 700 }}>
                    Causal Event Graph
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 9, color: "#1A2744", letterSpacing: "0.1em" }}>
                    CLICK NODE FOR DETAILS
                  </span>
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <p style={{ fontSize: 10, color: "#1A3050", marginBottom: 12, letterSpacing: "0.05em" }}>
                    Hover to highlight connections · Click any node to view full event details
                  </p>
                  <CausalGraph graphData={scenario.graphData} accentColor={color} />
                </div>
              </div>

              {/* Right: Impact Over Time Chart */}
              <ImpactChart scenarioId={scenario.id} accentColor={color} />

            </div>

            {/* 4 · AI Analysis Report */}
            <div style={{ marginBottom: 28 }}>
              <ReportHeader color={color} isLive={!aiResult._fallback} />
              <AnalysisPanel result={aiResult} category={scenario.category} color={color} />
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
