/**
 * Simulation Result Component
 * Displays the results of scenario simulation
 */

import { useState } from "react";

// ── Risk Badge ────────────────────────────────────────────────────────────

function RiskBadge({ level }) {
  const colors = {
    Low: "#22C55E",
    Moderate: "#F59E0B",
    High: "#F97316",
    Critical: "#EF4444"
  };
  const color = colors[level] || "#64748B";
  
  return (
    <span style={{
      padding: "4px 12px",
      background: `${color}18`,
      border: `1px solid ${color}40`,
      borderRadius: 6,
      fontSize: 11, fontWeight: 700,
      color: color,
      letterSpacing: "0.08em",
    }}>
      {level?.toUpperCase() || "UNKNOWN"}
    </span>
  );
}

// ── Timeline Item ─────────────────────────────────────────────────────────

function TimelineItem({ time, title, description, isLast }) {
  return (
    <div style={{ display: "flex", gap: 14, position: "relative" }}>
      {/* Timeline line */}
      {!isLast && (
        <div style={{
          position: "absolute",
          left: 7,
          top: 20,
          bottom: -14,
          width: 2,
          background: "linear-gradient(180deg, #1A2744, #1A2744)",
        }} />
      )}
      
      {/* Dot */}
      <div style={{
        width: 16, height: 16,
        borderRadius: "50%",
        background: "#070E1C",
        border: "2px solid #22D3EE",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        zIndex: 1,
      }}>
        <div style={{
          width: 6, height: 6,
          borderRadius: "50%",
          background: "#22D3EE",
        }} />
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, paddingBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{
            fontSize: 9, fontWeight: 700,
            color: "#22D3EE", letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            {time}
          </span>
          <RiskBadge level={title} />
        </div>
        <p style={{
          margin: 0,
          fontSize: 13, color: "#CBD5E1",
          lineHeight: 1.55,
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}

// ── Action Item ───────────────────────────────────────────────────────────

function ActionItem({ action, index }) {
  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-start",
      padding: "10px 14px",
      background: "#070E1C",
      border: "1px solid #152035",
      borderRadius: 8,
    }}>
      <span style={{
        width: 24, height: 24,
        borderRadius: "50%",
        background: "#22D3EE18",
        border: "1px solid #22D3EE40",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 700,
        color: "#22D3EE", flexShrink: 0,
      }}>
        {index + 1}
      </span>
      <p style={{ margin: 0, fontSize: 13, color: "#CBD5E1", lineHeight: 1.5 }}>
        {action}
      </p>
    </div>
  );
}

// ── Impact Item ───────────────────────────────────────────────────────────

function ImpactItem({ impact }) {
  const iconMap = {
    population: "👥",
    infrastructure: "🏗",
    transport: "🚗",
    health: "🏥",
    economy: "💰",
    default: "⚡"
  };
  
  return (
    <div style={{
      background: "#070E1C",
      border: "1px solid #152035",
      borderRadius: 10,
      padding: "14px 16px",
      textAlign: "center",
    }}>
      <p style={{ margin: "0 0 8px", fontSize: 22 }}>
        {iconMap[impact.type] || iconMap.default}
      </p>
      <p style={{
        margin: "0 0 4px",
        fontSize: 9, fontWeight: 700,
        color: "#2D4A6B", letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}>
        {impact.label}
      </p>
      <p style={{
        margin: 0,
        fontSize: 13, fontWeight: 600,
        color: "#CBD5E1",
      }}>
        {impact.value}
      </p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────

export default function SimulationResult({ result, onClear }) {
  const [expanded, setExpanded] = useState(true);
  
  if (!result) return null;
  
  const {
    predictedEventChain = [],
    cascadingImpacts = [],
    riskLevel = "Unknown",
    recommendedActions = [],
    estimatedTimeToImpact = {},
    confidenceScore = 0,
  } = result;
  
  return (
    <div style={{
      background: "#060C18",
      border: "1px solid #22D3EE30",
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 22,
      animation: "fadeUp 0.4s ease",
      boxShadow: "0 0 30px #22D3EE10",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 22px",
        borderBottom: "1px solid #152035",
        display: "flex", alignItems: "center", gap: 10,
        background: "linear-gradient(90deg, #22D3EE15, transparent)",
      }}>
        <span style={{
          fontSize: 16,
        }}>
          🔮
        </span>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
          color: "#22D3EE", textTransform: "uppercase",
        }}>
          Simulation Result
        </span>
        
        {/* Confidence Badge */}
        <div style={{
          marginLeft: "auto",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{
            fontSize: 9, color: "#475569",
            letterSpacing: "0.1em",
          }}>
            Confidence:
          </span>
          <span style={{
            padding: "3px 8px",
            background: "#22D3EE18",
            borderRadius: 4,
            fontSize: 11, fontWeight: 700,
            color: "#22D3EE",
          }}>
            {confidenceScore}%
          </span>
        </div>
        
        {/* Clear Button */}
        {onClear && (
          <button
            onClick={onClear}
            style={{
              marginLeft: 8,
              padding: "4px 10px",
              background: "transparent",
              border: "1px solid #1A2744",
              borderRadius: 4,
              color: "#475569",
              fontSize: 10,
              cursor: "pointer",
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Content */}
      {expanded && (
        <div style={{ padding: "20px 22px" }}>
          
          {/* Risk Level Summary */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "16px 20px",
            background: "#070E1C",
            border: "1px solid #152035",
            borderRadius: 10,
            marginBottom: 20,
          }}>
            <div>
              <p style={{
                margin: "0 0 4px",
                fontSize: 9, fontWeight: 700,
                color: "#475569", letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}>
                Overall Risk Level
              </p>
              <RiskBadge level={riskLevel} />
            </div>
            <div style={{
              flex: 1,
              borderLeft: "1px solid #152035",
              paddingLeft: 16,
            }}>
              <p style={{
                margin: "0 0 4px",
                fontSize: 9, fontWeight: 700,
                color: "#475569", letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}>
                Prediction Summary
              </p>
              <p style={{
                margin: 0,
                fontSize: 12, color: "#94A3B8",
                lineHeight: 1.5,
              }}>
                {predictedEventChain[0] || "Simulation complete. Review the predicted outcomes below."}
              </p>
            </div>
          </div>

          {/* Time to Impact Timeline */}
          {Object.keys(estimatedTimeToImpact).length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{
                margin: "0 0 14px",
                fontSize: 10, fontWeight: 700,
                color: "#2D4A6B", letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}>
                Estimated Time to Impact
              </h4>
              <div style={{
                background: "#040A14",
                border: "1px solid #0F1E35",
                borderRadius: 10,
                padding: "16px 20px",
              }}>
                {estimatedTimeToImpact.immediate && (
                  <TimelineItem
                    time="0-2 HOURS"
                    title={riskLevel}
                    description={estimatedTimeToImpact.immediate}
                    isLast={!estimatedTimeToImpact.shortTerm && !estimatedTimeToImpact.longTerm}
                  />
                )}
                {estimatedTimeToImpact.shortTerm && (
                  <TimelineItem
                    time="2-6 HOURS"
                    title="Escalation"
                    description={estimatedTimeToImpact.shortTerm}
                    isLast={!estimatedTimeToImpact.longTerm}
                  />
                )}
                {estimatedTimeToImpact.longTerm && (
                  <TimelineItem
                    time="6-24 HOURS"
                    title="Peak Impact"
                    description={estimatedTimeToImpact.longTerm}
                    isLast={true}
                  />
                )}
              </div>
            </div>
          )}

          {/* Cascading Impacts */}
          {cascadingImpacts.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{
                margin: "0 0 14px",
                fontSize: 10, fontWeight: 700,
                color: "#2D4A6B", letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}>
                Possible Cascading Impacts
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {cascadingImpacts.map((impact, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, alignItems: "center",
                    padding: "12px 16px",
                    background: "#070E1C",
                    border: "1px solid #F9731630",
                    borderRadius: 8,
                  }}>
                    <span style={{
                      width: 8, height: 8,
                      borderRadius: "50%",
                      background: "#F97316",
                      flexShrink: 0,
                    }} />
                    <p style={{ margin: 0, fontSize: 13, color: "#CBD5E1", lineHeight: 1.5 }}>
                      {impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          {recommendedActions.length > 0 && (
            <div>
              <h4 style={{
                margin: "0 0 14px",
                fontSize: 10, fontWeight: 700,
                color: "#2D4A6B", letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}>
                Recommended Actions
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {recommendedActions.map((action, i) => (
                  <ActionItem key={i} action={action} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

