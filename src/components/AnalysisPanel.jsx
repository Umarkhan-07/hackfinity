/**
 * CivicAI Response System - Analysis Panel
 * Comprehensive AI Decision Support Display
 * 
 * Features:
 * - System Insight Alert (warning card)
 * - Risk Level with Confidence Score
 * - Recommended Decision Panel
 * - Future Scenario Branches (visual tree)
 * - Action Plan (3 layers: Immediate/Short-term/Long-term)
 * - Impact Estimation Metrics
 * - City Resource Context
 * - Additional Information Needed (Question Loop)
 * - System Log Panel
 */

import { useState } from "react";

// ── Helper Components ─────────────────────────────────────────────────────

function Card({ icon, title, accent, delay = 0, children, fullWidth, noPadding }) {
  return (
    <div style={{
      background: "#070E1C",
      border: `1px solid ${accent}28`,
      borderRadius: 12,
      overflow: "hidden",
      gridColumn: fullWidth ? "1 / -1" : undefined,
      animation: `fadeUp 0.45s ease ${delay}ms both`,
      boxShadow: `0 0 24px ${accent}07, inset 0 1px 0 ${accent}0C`,
    }}>
      <div style={{
        padding: "11px 19px",
        borderBottom: `1px solid ${accent}18`,
        display: "flex", alignItems: "center", gap: 9,
        background: `linear-gradient(90deg, ${accent}0C, transparent)`,
      }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
          color: accent, textTransform: "uppercase",
        }}>
          {title}
        </span>
      </div>
      <div style={{ padding: noPadding ? 0 : "16px 19px" }}>
        {children}
      </div>
    </div>
  );
}

function Paragraph({ text }) {
  return (
    <p style={{ margin: 0, fontSize: 13.5, color: "#CBD5E1", lineHeight: 1.78 }}>
      {text || "—"}
    </p>
  );
}

function NumberedList({ items, accent, compact }) {
  if (!items?.length) return <p style={{ fontSize: 12, color: "#2D4A6B", fontStyle: "italic" }}>No data.</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 6 : 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: "flex", gap: 12, alignItems: "flex-start",
          padding: compact ? "6px 10px" : "10px 14px",
          background: `${accent}07`,
          border: `1px solid ${accent}15`,
          borderRadius: 8,
        }}>
          <span style={{
            flexShrink: 0, width: 22, height: 22, borderRadius: "50%",
            border: `1.5px solid ${accent}50`,
            background: `${accent}15`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 700, color: accent, marginTop: 1,
          }}>
            {i + 1}
          </span>
          <p style={{ margin: 0, fontSize: compact ? 12.5 : 13.5, color: "#CBD5E1", lineHeight: 1.65, paddingTop: 1 }}>
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

function BulletList({ items, accent, dotColor }) {
  const dot = dotColor || accent;
  if (!items?.length) return null;
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{
            flexShrink: 0, width: 6, height: 6, borderRadius: "50%",
            background: dot, boxShadow: `0 0 5px ${dot}80`,
            marginTop: 7,
          }} />
          <p style={{ margin: 0, fontSize: 13.5, color: "#94A3B8", lineHeight: 1.65 }}>{item}</p>
        </li>
      ))}
    </ul>
  );
}

function MetaBadge({ label, value, color, icon }) {
  return (
    <div style={{
      background: "#070E1C",
      border: `1px solid ${color}25`,
      borderRadius: 9,
      padding: "12px 16px",
      boxShadow: `inset 0 0 14px ${color}07`,
    }}>
      <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#2D4A6B", textTransform: "uppercase" }}>
        {icon} {label}
      </p>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color, lineHeight: 1.3 }}>
        {value}
      </p>
    </div>
  );
}

// ── SYSTEM INSIGHT ALERT CARD ────────────────────────────────────────────

function SystemInsightCard({ insight, riskLevel, color }) {
  const riskColors = {
    Low: "#22C55E",
    Moderate: "#F59E0B",
    High: "#F97316",
    Critical: "#EF4444"
  };
  const alertColor = riskColors[riskLevel] || color;
  
  return (
    <div style={{
      background: `linear-gradient(135deg, ${alertColor}15 0%, ${alertColor}05 100%)`,
      border: `1px solid ${alertColor}40`,
      borderRadius: 14,
      padding: "20px 24px",
      marginBottom: 24,
      animation: "fadeUp 0.4s ease",
      boxShadow: `0 0 30px ${alertColor}15, inset 0 0 20px ${alertColor}08`,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, height: "3px",
        background: `linear-gradient(90deg, ${alertColor}, transparent)`,
      }} />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: `${alertColor}20`,
          border: `2px solid ${alertColor}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0,
        }}>
          ⚠
        </div>
        <div style={{ flex: 1 }}>
          <p style={{
            margin: "0 0 8px",
            fontSize: 9, fontWeight: 700,
            letterSpacing: "0.2em", color: alertColor,
            textTransform: "uppercase",
          }}>
            System Insight
          </p>
          <p style={{
            margin: 0,
            fontSize: 16, fontWeight: 600,
            color: "#F1F5F9", lineHeight: 1.55,
          }}>
            {insight || "Analyzing incident data..."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── RISK LEVEL BADGE WITH CONFIDENCE ─────────────────────────────────────

function RiskLevelBadge({ riskLevel, confidenceScore, color }) {
  const riskColors = {
    Low: "#22C55E",
    Moderate: "#F59E0B",
    High: "#F97316",
    Critical: "#EF4444"
  };
  const badgeColor = riskColors[riskLevel] || color;
  
  // Calculate meter percentage
  const percentage = Math.min(Math.max(confidenceScore || 0, 0), 100);
  
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "16px 20px",
      background: "#070E1C",
      border: `1px solid ${badgeColor}30`,
      borderRadius: 12,
      marginBottom: 20,
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: `conic-gradient(${badgeColor} ${percentage * 3.6}deg, #1A2744 0deg)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "#070E1C",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column",
          }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: badgeColor }}>
              {percentage}%
            </span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{
          margin: "0 0 6px",
          fontSize: 9, fontWeight: 700,
          letterSpacing: "0.18em", color: "#2D4A6B",
          textTransform: "uppercase",
        }}>
          Confidence Score
        </p>
        <p style={{
          margin: 0, fontSize: 11, color: "#64748B",
          lineHeight: 1.5,
        }}>
          AI confidence in risk assessment based on available data quality and historical patterns
        </p>
      </div>
      <div style={{
        padding: "10px 20px",
        background: `${badgeColor}18`,
        border: `1px solid ${badgeColor}40`,
        borderRadius: 8,
      }}>
        <p style={{
          margin: 0,
          fontSize: 20, fontWeight: 800,
          color: badgeColor,
          letterSpacing: "0.05em",
        }}>
          {riskLevel?.toUpperCase() || "ASSESSING"}
        </p>
        <p style={{
          margin: "2px 0 0",
          fontSize: 8, fontWeight: 700,
          letterSpacing: "0.16em", color: "#475569",
          textTransform: "uppercase",
        }}>
          Risk Level
        </p>
      </div>
    </div>
  );
}

// ── RECOMMENDED DECISION PANEL ───────────────────────────────────────────

function DecisionPanel({ recommendation, color }) {
  if (!recommendation) return null;
  
  return (
    <div style={{
      background: `linear-gradient(135deg, #22C55E10 0%, #22C55E05 100%)`,
      border: "1px solid #22C55E35",
      borderRadius: 14,
      padding: "20px 24px",
      marginBottom: 20,
      animation: "fadeUp 0.4s ease 100ms both",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 14,
      }}>
        <span style={{ fontSize: 18 }}>🎯</span>
        <span style={{
          fontSize: 10, fontWeight: 700,
          letterSpacing: "0.2em", color: "#22C55E",
          textTransform: "uppercase",
        }}>
          Recommended Decision
        </span>
      </div>
      <div style={{
        background: "#060C18",
        border: "1px solid #22C55E20",
        borderRadius: 10,
        padding: "18px 22px",
      }}>
        <p style={{
          margin: "0 0 12px",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "0.12em", color: "#22C55E",
          textTransform: "uppercase",
        }}>
          Primary Action
        </p>
        <p style={{
          margin: "0 0 16px",
          fontSize: 15, fontWeight: 600,
          color: "#F1F5F9", lineHeight: 1.55,
        }}>
          {recommendation.primaryAction || "Awaiting analysis..."}
        </p>
        <div style={{ borderTop: "1px solid #152035", paddingTop: 14 }}>
          <p style={{
            margin: "0 0 6px",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.12em", color: "#475569",
            textTransform: "uppercase",
          }}>
            Reason
          </p>
          <p style={{
            margin: 0,
            fontSize: 13, color: "#94A3B8", lineHeight: 1.6,
          }}>
            {recommendation.reason || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── FUTURE SCENARIO BRANCHES ─────────────────────────────────────────────

function FutureBranchesPanel({ branches, color }) {
  const probColors = {
    high: "#22C55E",
    medium: "#F59E0B",
    low: "#64748B"
  };
  
  if (!branches?.length) return null;
  
  return (
    <Card icon="🔮" title="Future Scenario Branches" accent={color} delay={200} fullWidth>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {branches.map((branch, idx) => (
          <div key={idx} style={{
            background: "#060C18",
            border: "1px solid #152035",
            borderRadius: 10,
            padding: "16px 18px",
          }}>
            <p style={{
              margin: "0 0 12px",
              fontSize: 11, fontWeight: 700,
              color: color, letterSpacing: "0.1em",
            }}>
              {branch.title}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {branch.branches?.map((b, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "8px 12px",
                  background: `${probColors[b.probability]}08`,
                  border: `1px solid ${probColors[b.probability]}15`,
                  borderRadius: 6,
                }}>
                  <span style={{
                    padding: "2px 8px",
                    fontSize: 8, fontWeight: 700,
                    color: probColors[b.probability],
                    background: `${probColors[b.probability]}18`,
                    borderRadius: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}>
                    {b.probability}
                  </span>
                  <p style={{
                    margin: 0, fontSize: 12.5, color: "#CBD5E1",
                    lineHeight: 1.45,
                  }}>
                    {b.outcome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── ACTION PLAN (3 LAYERS) ───────────────────────────────────────────────

function ActionPlanPanel({ actionPlan, color }) {
  if (!actionPlan) return null;
  
  const layers = [
    { key: "immediate", label: "Immediate", icon: "🚨", color: "#EF4444", time: "0-30 min" },
    { key: "shortTerm", label: "Short-Term", icon: "⏱", color: "#F59E0B", time: "1-6 hours" },
    { key: "longTerm", label: "Long-Term", icon: "🛡", color: "#22C55E", time: "1-4 weeks" },
  ];
  
  return (
    <Card icon="✅" title="Action Plan" accent={color} delay={300} fullWidth>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {layers.map((layer) => (
          <div key={layer.key} style={{
            background: "#060C18",
            border: `1px solid ${layer.color}25`,
            borderRadius: 10,
            overflow: "hidden",
          }}>
            <div style={{
              padding: "10px 14px",
              background: `${layer.color}12`,
              borderBottom: `1px solid ${layer.color}20`,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>{layer.icon}</span>
              <div>
                <p style={{
                  margin: 0, fontSize: 10, fontWeight: 700,
                  color: layer.color, letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  {layer.label}
                </p>
                <p style={{
                  margin: 0, fontSize: 8, color: "#475569",
                }}>
                  {layer.time}
                </p>
              </div>
            </div>
            <div style={{ padding: "12px 14px" }}>
              {actionPlan[layer.key]?.length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {actionPlan[layer.key].map((action, i) => (
                    <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: layer.color, marginTop: 6, flexShrink: 0,
                      }} />
                      <p style={{ margin: 0, fontSize: 11.5, color: "#94A3B8", lineHeight: 1.5 }}>
                        {action}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, fontSize: 11, color: "#475569", fontStyle: "italic" }}>
                  No actions specified
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── IMPACT ESTIMATION ───────────────────────────────────────────────────

function ImpactEstimationPanel({ impact, color }) {
  if (!impact) return null;
  
  const metrics = [
    { key: "affectedPopulation", label: "Affected Population", icon: "👥" },
    { key: "hospitalDemand", label: "Hospital Demand", icon: "🏥" },
    { key: "trafficDelay", label: "Traffic Delay", icon: "🚗" },
    { key: "emergencyResourceRequirement", label: "Emergency Resources", icon: "🚒" },
  ];
  
  return (
    <Card icon="📊" title="Impact Estimation" accent={color} delay={400} fullWidth>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {metrics.map((metric) => (
          <div key={metric.key} style={{
            background: "#060C18",
            border: "1px solid #152035",
            borderRadius: 10,
            padding: "14px 16px",
            textAlign: "center",
          }}>
            <p style={{ margin: "0 0 8px", fontSize: 20 }}>{metric.icon}</p>
            <p style={{
              margin: "0 0 4px",
              fontSize: 9, fontWeight: 700,
              color: "#2D4A6B", letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>
              {metric.label}
            </p>
            <p style={{
              margin: 0,
              fontSize: 13, fontWeight: 600,
              color: "#CBD5E1", lineHeight: 1.4,
            }}>
              {impact[metric.key] || "—"}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── CITY RESOURCES CONTEXT ───────────────────────────────────────────────

function CityResourcesPanel({ resources, color }) {
  if (!resources) return null;
  
  const categories = [
    { key: "nearbyHospitals", label: "Hospitals", icon: "🏥" },
    { key: "fireStations", label: "Fire Stations", icon: "🚒" },
    { key: "evacuationRoutes", label: "Evacuation Routes", icon: "🛣" },
    { key: "shelters", label: "Shelters", icon: "🏠" },
  ];
  
  return (
    <Card icon="🏙" title="City Resource Context" accent={color} delay={500}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {categories.map((cat) => (
          <div key={cat.key}>
            <p style={{
              margin: "0 0 6px",
              fontSize: 9, fontWeight: 700,
              color: color, letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              {cat.icon} {cat.label}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {resources[cat.key]?.length > 0 ? (
                resources[cat.key].map((item, i) => (
                  <span key={i} style={{
                    padding: "4px 10px",
                    background: "#0F1E35",
                    border: "1px solid #1A2744",
                    borderRadius: 5,
                    fontSize: 11, color: "#94A3B8",
                  }}>
                    {item}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: 11, color: "#475569" }}>—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── ADDITIONAL INFO NEEDED (QUESTION LOOP) ───────────────────────────────

function AdditionalInfoPanel({ questions, onProvideInfo, color }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  if (!questions?.length) return null;
  
  const handleSubmit = () => {
    setSubmitted(true);
    if (onProvideInfo) {
      onProvideInfo(answers);
    }
  };
  
  return (
    <div style={{
      background: "#070E1C",
      border: "1px solid #F59E0B28",
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 20,
      animation: "fadeUp 0.45s ease 600ms both",
    }}>
      <div style={{
        padding: "11px 19px",
        borderBottom: "1px solid #F59E0B18",
        display: "flex", alignItems: "center", gap: 9,
        background: "linear-gradient(90deg, #F59E0B0C, transparent)",
      }}>
        <span style={{ fontSize: 14 }}>❓</span>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
          color: "#F59E0B", textTransform: "uppercase",
        }}>
          Additional Information Needed
        </span>
      </div>
      <div style={{ padding: "16px 19px" }}>
        {!submitted ? (
          <>
            <p style={{
              margin: "0 0 14px",
              fontSize: 12, color: "#94A3B8", lineHeight: 1.5,
            }}>
              The AI requires additional data to provide more accurate recommendations:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {questions.map((q, i) => (
                <div key={i}>
                  <p style={{
                    margin: "0 0 6px",
                    fontSize: 11, fontWeight: 600,
                    color: "#CBD5E1",
                  }}>
                    {q}
                  </p>
                  <input
                    type="text"
                    placeholder="Enter value..."
                    value={answers[i] || ""}
                    onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "#0A1628",
                      border: "1px solid #1E293B",
                      borderRadius: 6,
                      color: "#E2E8F0",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                border: "none", borderRadius: 6,
                color: "#040A14",
                fontSize: 11, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Provide Information & Re-analyze
            </button>
          </>
        ) : (
          <div style={{
            padding: "14px",
            background: "#22C55E10",
            border: "1px solid #22C55E25",
            borderRadius: 8,
            textAlign: "center",
          }}>
            <p style={{ margin: 0, fontSize: 13, color: "#22C55E" }}>
              ✓ Information submitted. AI will re-analyze with updated data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SYSTEM LOG PANEL ─────────────────────────────────────────────────────

function SystemLogPanel({ logs, color }) {
  const defaultLogs = [
    { time: "21:10", message: "Scenario Loaded", status: "complete" },
    { time: "21:11", message: "Event Graph Generated", status: "complete" },
    { time: "21:12", message: "AI Risk Analysis Complete", status: "complete" },
    { time: "21:13", message: "Response Plan Generated", status: "complete" },
  ];
  
  const displayLogs = logs || defaultLogs;
  
  return (
    <Card icon="📋" title="System Log" accent={color || "#64748B"} delay={700}>
      <div style={{
        background: "#040A14",
        border: "1px solid #0F1E35",
        borderRadius: 8,
        padding: "12px 14px",
        maxHeight: 180,
        overflow: "auto",
      }}>
        {displayLogs.map((log, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "6px 0",
            borderBottom: i < displayLogs.length - 1 ? "1px solid #0A1628" : "none",
          }}>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: "#475569", fontFamily: "'DM Mono', monospace",
              minWidth: 45,
            }}>
              {log.time}
            </span>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: log.status === "complete" ? "#22C55E" : 
                          log.status === "active" ? "#F59E0B" : "#64748B",
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 11, color: "#94A3B8",
              flex: 1,
            }}>
              {log.message}
            </span>
            {log.status === "complete" && (
              <span style={{ fontSize: 10, color: "#22C55E" }}>✓</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────

export default function AnalysisPanel({ result, category, color, onProvideInfo }) {
  if (!result) return null;

  // Determine category key
  const catKey =
    result.category === "frequent"  ? "frequent"   :
    result.category === "rare"      ? "rare"        :
    result.category === "predictive"? "predictive"  :
    category?.toLowerCase().includes("frequent")  ? "frequent"   :
    category?.toLowerCase().includes("rare")      ? "rare"        :
    "predictive";

  // Map risk level strings to standardized format
  const riskLevel = result.riskLevel || (result.severityLevel === "critical" ? "Critical" : 
                                          result.severityLevel === "high" ? "High" :
                                          result.severityLevel === "medium" ? "Moderate" : "Low");

  return (
    <div>
      {/* 1. System Insight Alert */}
      <SystemInsightCard 
        insight={result.systemInsight || result.futureRiskForecast} 
        riskLevel={riskLevel}
        color={color}
      />
      
      {/* 2. Risk Level with Confidence Score */}
      <RiskLevelBadge 
        riskLevel={riskLevel} 
        confidenceScore={result.confidenceScore} 
        color={color}
      />
      
      {/* 3. Recommended Decision */}
      <DecisionPanel 
        recommendation={result.decisionRecommendation} 
        color={color}
      />
      
      {/* 4. Future Scenario Branches */}
      <FutureBranchesPanel 
        branches={result.futureScenarioBranches} 
        color={color}
      />
      
      {/* 5. Action Plan (3 layers) */}
      <ActionPlanPanel 
        actionPlan={result.actionPlan} 
        color={color}
      />
      
      {/* 6. Impact Estimation */}
      <ImpactEstimationPanel 
        impact={result.impactEstimation || {
          affectedPopulation: result.populationAtRisk || result.estimatedAffected,
          hospitalDemand: result.hospitalDemand,
          trafficDelay: result.trafficDelay,
          emergencyResourceRequirement: result.resourceRequirements?.join(", ")
        }} 
        color={color}
      />
      
      {/* 7. City Resources & 8. Additional Info Needed */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <CityResourcesPanel 
          resources={result.cityResources} 
          color={color}
        />
        <SystemLogPanel 
          logs={result.systemLog} 
          color={color}
        />
      </div>
      
      {/* 10. Additional Information Needed (Question Loop) */}
      <AdditionalInfoPanel 
        questions={result.additionalInfoNeeded} 
        onProvideInfo={onProvideInfo}
        color={color}
      />
    </div>
  );
}

