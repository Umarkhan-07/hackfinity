/**
 * Scenario Simulator Component
 * Allows users to input custom event conditions and simulate potential outcomes
 */

import { useState } from "react";

const EVENT_TYPES = [
  { value: "traffic", label: "Traffic" },
  { value: "industrial", label: "Industrial Accident" },
  { value: "flood", label: "Flood Risk" },
  { value: "custom", label: "Custom Event" },
];

export default function ScenarioSimulator({ onSimulate, isSimulating }) {
  const [eventType, setEventType] = useState("traffic");
  const [condition, setCondition] = useState("");
  const [error, setError] = useState("");

  const handleSimulate = () => {
    if (!condition.trim()) {
      setError("Please enter a condition description");
      return;
    }
    if (condition.length < 10) {
      setError("Please provide more detail (at least 10 characters)");
      return;
    }
    setError("");
    onSimulate({ eventType, condition });
  };

  const exampleConditions = [
    { type: "traffic", text: "major accident blocks highway" },
    { type: "industrial", text: "chemical leak spreading due to wind" },
    { type: "flood", text: "rainfall continues for 6 hours" },
  ];

  const setExample = (type) => {
    const example = exampleConditions.find(e => e.type === type);
    if (example) {
      setEventType(type);
      setCondition(example.text);
    }
  };

  return (
    <div style={{
      background: "#060C18",
      border: "1px solid #152035",
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 22,
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 22px",
        borderBottom: "1px solid #152035",
        display: "flex", alignItems: "center", gap: 10,
        background: "linear-gradient(90deg, #22D3EE10, transparent)",
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "#22D3EE", boxShadow: "0 0 8px #22D3EE",
          animation: "pulse 2s ease-in-out infinite",
        }} />
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
          color: "#22D3EE", textTransform: "uppercase",
        }}>
          Scenario Simulator
        </span>
        <span style={{
          marginLeft: "auto", fontSize: 9, color: "#1A2744",
          letterSpacing: "0.1em",
        }}>
          PREDICTIVE MODELING
        </span>
      </div>

      {/* Input Section */}
      <div style={{ padding: "20px 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>
          {/* Event Type Dropdown */}
          <div>
            <label style={{
              display: "block", marginBottom: 8,
              fontSize: 9, fontWeight: 700,
              color: "#475569", letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              disabled={isSimulating}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "#070E1C",
                border: "1px solid #1A2744",
                borderRadius: 8,
                color: "#E2E8F0",
                fontSize: 13,
                outline: "none",
                cursor: "pointer",
                appearance: "none",
              }}
            >
              {EVENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Condition Input */}
          <div>
            <label style={{
              display: "block", marginBottom: 8,
              fontSize: 9, fontWeight: 700,
              color: "#475569", letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>
              Condition Description
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="Describe the situation (e.g., 'heavy rainfall for 6 hours')"
              disabled={isSimulating}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "#070E1C",
                border: "1px solid #1A2744",
                borderRadius: 8,
                color: "#E2E8F0",
                fontSize: 13,
                outline: "none",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSimulating) {
                  handleSimulate();
                }
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: "10px 14px",
            background: "#7F1D1D20",
            border: "1px solid #7F1D1D40",
            borderRadius: 6,
            marginBottom: 16,
            color: "#FCA5A5",
            fontSize: 12,
          }}>
            {error}
          </div>
        )}

        {/* Quick Examples */}
        <div style={{ marginBottom: 16 }}>
          <p style={{
            margin: "0 0 8px",
            fontSize: 9, fontWeight: 700,
            color: "#2D4A6B", letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            Quick Examples
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {exampleConditions.map((ex, i) => (
              <button
                key={i}
                onClick={() => setExample(ex.type)}
                disabled={isSimulating}
                style={{
                  padding: "6px 12px",
                  background: "#0F1E35",
                  border: "1px solid #1A2744",
                  borderRadius: 5,
                  color: "#64748B",
                  fontSize: 11,
                  cursor: "pointer",
                  opacity: isSimulating ? 0.5 : 1,
                }}
              >
                {ex.text}
              </button>
            ))}
          </div>
        </div>

        {/* Simulate Button */}
        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          style={{
            padding: "14px 32px",
            background: isSimulating 
              ? "linear-gradient(135deg, #1A2744 0%, #0F1E35 100%)"
              : "linear-gradient(135deg, #22D3EE 0%, #0EA5E9 100%)",
            border: "none",
            borderRadius: 8,
            color: isSimulating ? "#475569" : "#040A14",
            fontSize: 12, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            cursor: isSimulating ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: 10,
          }}
        >
          {isSimulating ? (
            <>
              <span style={{
                width: 14, height: 14,
                border: "2px solid #1A2744",
                borderTop: "2px solid #475569",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              Running Simulation...
            </>
          ) : (
            <>
              <span>⚡</span>
              Run Simulation
            </>
          )}
        </button>
      </div>
    </div>
  );
}

