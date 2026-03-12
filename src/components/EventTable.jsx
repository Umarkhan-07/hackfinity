/**
 * EventTable — scenario events in a clean tabular format with row hover
 */
import { useState } from "react";

export default function EventTable({ events, accentColor }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      background: "#070E1C",
      border: "1px solid #1A2744",
      borderRadius: 10,
      overflow: "hidden",
    }}>
      {/* Section header */}
      <div style={{
        padding: "11px 22px",
        borderBottom: "1px solid #1A2744",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#060C18",
      }}>
        <span style={{
          display: "inline-block", width: 6, height: 6, borderRadius: "50%",
          background: accentColor, boxShadow: `0 0 6px ${accentColor}`,
        }} />
        <span style={{
          fontSize: 10, letterSpacing: "0.14em", color: "#475569",
          textTransform: "uppercase", fontWeight: 600,
        }}>
          Scenario Events
        </span>
        <span style={{
          marginLeft: "auto", fontSize: 10, color: "#1E3A5F",
          letterSpacing: "0.1em",
        }}>
          {events.length} RECORDS
        </span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #0F1E35" }}>
            {["Time", "Event", "Location", "Value / Status"].map((h) => (
              <th key={h} style={{
                padding: "9px 22px", textAlign: "left",
                fontSize: 9, color: "#2D4A6B", fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((e, i) => {
            const isHov = hovered === i;
            return (
              <tr
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  borderBottom: "1px solid #0A1628",
                  background: isHov ? `${accentColor}08` : "transparent",
                  transition: "background 0.15s ease",
                  cursor: "default",
                }}
              >
                <td style={{ padding: "11px 22px", fontSize: 12, color: accentColor, fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                  {e.time}
                </td>
                <td style={{ padding: "11px 22px", fontSize: 13, color: isHov ? "#F1F5F9" : "#CBD5E1", transition: "color 0.15s" }}>
                  {e.event}
                </td>
                <td style={{ padding: "11px 22px", fontSize: 12, color: "#64748B" }}>
                  {e.location}
                </td>
                <td style={{ padding: "11px 22px", fontSize: 11, color: e.value ? "#94A3B8" : "#2D4A6B", fontStyle: e.value ? "normal" : "italic" }}>
                  {e.value ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
