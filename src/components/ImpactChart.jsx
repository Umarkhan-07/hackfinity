/**
 * ImpactChart — Impact-over-time predictions for all 3 urban scenarios.
 * Prompts 1, 3 & 4: multi-line / area SVG charts, dark CivicAI theme,
 * time-range selector, toggle-able legend, threshold annotations, tooltips.
 * Zero external dependencies — pure React + SVG.
 */
import { useState } from "react";

// ── Chart data ────────────────────────────────────────────────────────────

const CHART_DATA = {
  traffic: {
    title: "Traffic Impact Projection",
    subtitle: "Affected commuters & average delay escalation",
    icon: "🚦",
    views: {
      "6hr": {
        labels: ["Now", "+1hr", "+2hr", "+3hr", "+4hr", "+6hr"],
        series: [
          {
            key: "commuters", label: "Affected Commuters", unit: "K",
            color: "#3B82F6", fill: false,
            values: [5, 12, 18, 22, 19, 10],
          },
          {
            key: "delay", label: "Avg Delay", unit: "min",
            color: "#F59E0B", fill: false,
            values: [15, 28, 42, 51, 45, 20],
            threshold: { value: 45, label: "Critical Delay" },
          },
        ],
      },
      "12hr": {
        labels: ["Now", "+1hr", "+2hr", "+3hr", "+4hr", "+6hr", "+8hr", "+10hr", "+12hr"],
        series: [
          {
            key: "commuters", label: "Affected Commuters", unit: "K",
            color: "#3B82F6", fill: false,
            values: [5, 12, 18, 22, 19, 10, 8, 6, 5],
          },
          {
            key: "delay", label: "Avg Delay", unit: "min",
            color: "#F59E0B", fill: false,
            values: [15, 28, 42, 51, 45, 20, 14, 10, 8],
            threshold: { value: 45, label: "Critical Delay" },
          },
        ],
      },
      "24hr": {
        labels: ["Now", "+2hr", "+4hr", "+6hr", "+8hr", "+12hr", "+16hr", "+20hr", "+24hr"],
        series: [
          {
            key: "commuters", label: "Affected Commuters", unit: "K",
            color: "#3B82F6", fill: false,
            values: [5, 18, 22, 10, 7, 5, 4, 4, 3],
          },
          {
            key: "delay", label: "Avg Delay", unit: "min",
            color: "#F59E0B", fill: false,
            values: [15, 42, 51, 20, 12, 8, 6, 5, 5],
            threshold: { value: 45, label: "Critical Delay" },
          },
        ],
      },
    },
  },

  factory: {
    title: "Factory Incident Spread",
    subtitle: "Chemical plume dispersion & population exposure",
    icon: "🏭",
    views: {
      "6hr": {
        labels: ["Now", "+30m", "+1hr", "+2hr", "+3hr", "+4hr"],
        series: [
          {
            key: "plume", label: "Plume Area", unit: "km²",
            color: "#EF4444", fill: true,
            values: [0.1, 0.5, 1.2, 2.8, 4.1, 5.5],
            threshold: { value: 2.8, label: "Mandatory Evacuation" },
          },
          {
            key: "exposed", label: "Exposed Population", unit: "×100",
            color: "#F97316", fill: false,
            values: [2, 8, 24, 48, 68, 80],
          },
        ],
      },
      "12hr": {
        labels: ["Now", "+1hr", "+2hr", "+3hr", "+4hr", "+6hr", "+8hr", "+10hr", "+12hr"],
        series: [
          {
            key: "plume", label: "Plume Area", unit: "km²",
            color: "#EF4444", fill: true,
            values: [0.1, 0.5, 1.2, 2.8, 4.1, 5.5, 6.2, 5.8, 4.5],
            threshold: { value: 2.8, label: "Mandatory Evacuation" },
          },
          {
            key: "exposed", label: "Exposed Population", unit: "×100",
            color: "#F97316", fill: false,
            values: [2, 8, 24, 48, 68, 80, 85, 78, 65],
          },
        ],
      },
      "24hr": {
        labels: ["Now", "+2hr", "+4hr", "+6hr", "+8hr", "+12hr", "+16hr", "+20hr", "+24hr"],
        series: [
          {
            key: "plume", label: "Plume Area", unit: "km²",
            color: "#EF4444", fill: true,
            values: [0.1, 1.2, 2.8, 5.5, 6.5, 5.8, 4.2, 3.0, 2.1],
            threshold: { value: 2.8, label: "Mandatory Evacuation" },
          },
          {
            key: "exposed", label: "Exposed Population", unit: "×100",
            color: "#F97316", fill: false,
            values: [2, 24, 48, 80, 85, 74, 52, 36, 22],
          },
        ],
      },
    },
  },

  flood: {
    title: "Flood Level Rise Projection",
    subtitle: "Water level rise & building inundation forecast",
    icon: "🌊",
    views: {
      "6hr": {
        labels: ["Now", "+30m", "+1hr", "+2hr", "+3hr", "+6hr"],
        series: [
          {
            key: "level", label: "Water Level", unit: "cm",
            color: "#3B82F6", fill: true,
            values: [20, 45, 85, 140, 180, 220],
            threshold: { value: 150, label: "Flood Stage" },
          },
          {
            key: "buildings", label: "Inundated Buildings", unit: "",
            color: "#EF4444", fill: false,
            values: [0, 5, 18, 45, 82, 120],
          },
        ],
      },
      "12hr": {
        labels: ["Now", "+1hr", "+2hr", "+3hr", "+6hr", "+8hr", "+10hr", "+11hr", "+12hr"],
        series: [
          {
            key: "level", label: "Water Level", unit: "cm",
            color: "#3B82F6", fill: true,
            values: [20, 45, 85, 140, 180, 210, 225, 215, 200],
            threshold: { value: 150, label: "Flood Stage" },
          },
          {
            key: "buildings", label: "Inundated Buildings", unit: "",
            color: "#EF4444", fill: false,
            values: [0, 5, 18, 45, 82, 110, 125, 118, 105],
          },
        ],
      },
      "24hr": {
        labels: ["Now", "+2hr", "+4hr", "+6hr", "+8hr", "+12hr", "+16hr", "+20hr", "+24hr"],
        series: [
          {
            key: "level", label: "Water Level", unit: "cm",
            color: "#3B82F6", fill: true,
            values: [20, 85, 140, 220, 225, 200, 160, 110, 70],
            threshold: { value: 150, label: "Flood Stage" },
          },
          {
            key: "buildings", label: "Inundated Buildings", unit: "",
            color: "#EF4444", fill: false,
            values: [0, 18, 45, 120, 125, 105, 72, 40, 18],
          },
        ],
      },
    },
  },
};

// ── SVG layout constants ──────────────────────────────────────────────────
const VW = 560, VH = 230;
const PL = 44, PR = 18, PT = 16, PB = 34;
const PW = VW - PL - PR;
const PH = VH - PT - PB;

// ── SVG helpers ───────────────────────────────────────────────────────────
function minMax(arr) {
  return [Math.min(...arr), Math.max(...arr)];
}

/** Normalize value to [0,1] within its series range */
function norm(v, mn, mx) {
  return mx === mn ? 0.5 : (v - mn) / (mx - mn);
}

/** Map index → SVG x, normalized value → SVG y */
function ptX(i, n) { return PL + (i / Math.max(n - 1, 1)) * PW; }
function ptY(n01)  { return PT + (1 - n01) * PH; }

function calcPts(values) {
  const [mn, mx] = minMax(values);
  return values.map((v, i) => ({
    x: ptX(i, values.length),
    y: ptY(norm(v, mn, mx)),
    v,
  }));
}

function linePath(pts) {
  return pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

function fillPath(pts) {
  const bottom = PT + PH;
  return `${linePath(pts)} L${pts.at(-1).x.toFixed(1)},${bottom} L${PL},${bottom} Z`;
}

// ── Inner SVG Chart ───────────────────────────────────────────────────────
function SVGChart({ labels, series, hiddenKeys, hoverIdx, onHover }) {
  const GRID_Y = [0, 0.25, 0.5, 0.75, 1];

  // Primary series = first visible with threshold (or just first visible)
  const primarySeries =
    series.find((s) => !hiddenKeys.has(s.key) && s.threshold) ||
    series.find((s) => !hiddenKeys.has(s.key));

  const [primMn, primMx] = primarySeries ? minMax(primarySeries.values) : [0, 100];

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
    >
      <defs>
        {series.map((s) => (
          <linearGradient key={s.key} id={`icfill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={s.color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
          </linearGradient>
        ))}
      </defs>

      {/* Y-axis ticks */}
      {GRID_Y.map((g) => {
        const y = PT + (1 - g) * PH;
        const val = primMn + g * (primMx - primMn);
        const disp = val < 10 ? val.toFixed(1) : Math.round(val);
        return (
          <g key={g}>
            <line x1={PL} y1={y} x2={PL + PW} y2={y} stroke="#0F1E35" strokeWidth="1" />
            <text
              x={PL - 5} y={y + 3.5}
              textAnchor="end" fill="#2D4A6B"
              fontSize="8" fontFamily="'DM Mono', monospace"
            >
              {disp}
            </text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {labels.map((l, i) => (
        <text
          key={i}
          x={ptX(i, labels.length)} y={VH - 4}
          textAnchor="middle" fill="#2D4A6B"
          fontSize="8" fontFamily="'DM Mono', monospace"
        >
          {l}
        </text>
      ))}

      {/* Axis border */}
      <line x1={PL} y1={PT} x2={PL} y2={PT + PH} stroke="#152035" strokeWidth="1" />
      <line x1={PL} y1={PT + PH} x2={PL + PW} y2={PT + PH} stroke="#152035" strokeWidth="1" />

      {/* Hover column */}
      {hoverIdx !== null && (
        <line
          x1={ptX(hoverIdx, labels.length)} y1={PT}
          x2={ptX(hoverIdx, labels.length)} y2={PT + PH}
          stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.35"
          strokeDasharray="4,3"
        />
      )}

      {/* Series */}
      {series.map((s) => {
        if (hiddenKeys.has(s.key)) return null;
        const pts = calcPts(s.values);
        const [smn, smx] = minMax(s.values);

        return (
          <g key={s.key}>
            {/* Fill */}
            {s.fill && (
              <path d={fillPath(pts)} fill={`url(#icfill-${s.key})`} />
            )}
            {/* Threshold */}
            {s.threshold && (
              (() => {
                const ty = ptY(norm(s.threshold.value, smn, smx));
                const inRange = ty >= PT && ty <= PT + PH;
                if (!inRange) return null;
                return (
                  <g>
                    <line
                      x1={PL} y1={ty} x2={PL + PW} y2={ty}
                      stroke={s.color} strokeWidth="1"
                      strokeDasharray="7,4" strokeOpacity="0.65"
                    />
                    <rect
                      x={PL + PW - 82} y={ty - 13}
                      width={80} height={12}
                      rx={2} fill="#040A14" fillOpacity="0.85"
                    />
                    <text
                      x={PL + PW - 4} y={ty - 4}
                      textAnchor="end" fill={s.color}
                      fontSize="7.5" fontFamily="'DM Mono', monospace"
                      fontWeight="700" opacity="0.9"
                    >
                      ▸ {s.threshold.label}
                    </text>
                  </g>
                );
              })()
            )}
            {/* Line */}
            <path
              d={linePath(pts)}
              fill="none" stroke={s.color} strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round"
            />
            {/* Dots */}
            {pts.map((p, i) => (
              <circle
                key={i}
                cx={p.x} cy={p.y}
                r={hoverIdx === i ? 5 : i === 0 ? 4 : 2.5}
                fill={hoverIdx === i || i === 0 ? s.color : "#040A14"}
                stroke={s.color} strokeWidth={hoverIdx === i ? "2" : "1.5"}
                style={{ transition: "r 0.1s" }}
              />
            ))}
          </g>
        );
      })}

      {/* Invisible hover-target columns */}
      {labels.map((_, i) => (
        <rect
          key={i}
          x={ptX(i, labels.length) - PW / Math.max(labels.length * 2, 1)}
          y={PT} width={PW / Math.max(labels.length, 1)} height={PH}
          fill="transparent"
          style={{ cursor: "crosshair" }}
          onMouseEnter={() => onHover(i)}
          onMouseLeave={() => onHover(null)}
        />
      ))}
    </svg>
  );
}

// ── Tooltip popup ─────────────────────────────────────────────────────────
function ChartTooltip({ idx, labels, series, hiddenKeys }) {
  if (idx === null) return null;
  const label = labels[idx];
  const entries = series.filter((s) => !hiddenKeys.has(s.key));

  return (
    <div style={{
      position: "absolute", top: 36, left: `${Math.max(4, Math.min(60, (idx / Math.max(labels.length - 1, 1)) * 100 - 8))}%`,
      background: "#060C18",
      border: "1px solid #1A2744",
      borderRadius: 8, padding: "10px 14px",
      minWidth: 130, zIndex: 20,
      boxShadow: "0 8px 32px #00000060",
      pointerEvents: "none",
    }}>
      <p style={{ margin: "0 0 8px", fontSize: 9, fontWeight: 700, color: "#22D3EE", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
        {label}
      </p>
      {entries.map((s) => (
        <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: "#64748B" }}>{s.label}:</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: s.color, marginLeft: "auto", fontFamily: "'DM Mono', monospace" }}>
            {s.values[idx]}{s.unit ? ` ${s.unit}` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function ImpactChart({ scenarioId, accentColor }) {
  const [timeRange, setTimeRange]   = useState("6hr");
  const [hiddenKeys, setHiddenKeys] = useState(new Set());
  const [hoverIdx, setHoverIdx]     = useState(null);

  const cfg = CHART_DATA[scenarioId];
  if (!cfg) return null;

  const view = cfg.views[timeRange];

  const toggleSeries = (key) => {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // Peak values for summary cards
  const peakCards = view.series.map((s) => ({
    label: s.label,
    peak: Math.max(...s.values),
    unit: s.unit,
    color: s.color,
    current: s.values[0],
  }));

  return (
    <div style={{
      background: "#060C18",
      border: "1px solid #152035",
      borderRadius: 12,
      overflow: "hidden",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid #152035",
        display: "flex", alignItems: "center", gap: 10,
        background: "#050A15", flexShrink: 0,
      }}>
        <span style={{ fontSize: 14 }}>{cfg.icon}</span>
        <div>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: accentColor || "#22D3EE", textTransform: "uppercase" }}>
            Impact Over Time
          </p>
          <p style={{ margin: 0, fontSize: 9, color: "#2D4A6B", letterSpacing: "0.04em" }}>
            {cfg.subtitle}
          </p>
        </div>
        {/* Time range selector */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
          {["6hr", "12hr", "24hr"].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              style={{
                padding: "4px 9px",
                borderRadius: 4,
                border: `1px solid ${timeRange === r ? (accentColor || "#22D3EE") : "#1A2744"}`,
                background: timeRange === r ? `${accentColor || "#22D3EE"}18` : "transparent",
                color: timeRange === r ? (accentColor || "#22D3EE") : "#334155",
                fontSize: 9, fontWeight: 700, fontFamily: "'DM Mono', monospace",
                cursor: "pointer", letterSpacing: "0.06em",
                transition: "all 0.15s",
              }}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Peak summary cards ───────────────────────────────────── */}
      <div style={{
        display: "grid", gridTemplateColumns: `repeat(${peakCards.length}, 1fr)`,
        gap: 0, borderBottom: "1px solid #0F1E35", flexShrink: 0,
      }}>
        {peakCards.map((c, i) => (
          <div
            key={c.label}
            style={{
              padding: "9px 14px",
              borderRight: i < peakCards.length - 1 ? "1px solid #0F1E35" : "none",
              cursor: "pointer",
              background: hiddenKeys.has(view.series[i].key) ? "#040810" : "transparent",
              transition: "background 0.15s",
            }}
            onClick={() => toggleSeries(view.series[i].key)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: c.color,
                opacity: hiddenKeys.has(view.series[i].key) ? 0.25 : 1,
              }} />
              <span style={{ fontSize: 8, fontWeight: 700, color: "#2D4A6B", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {c.label}
              </span>
              <span style={{ marginLeft: "auto", fontSize: 7, color: "#1A2744" }}>CLICK TO TOGGLE</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
              <span style={{
                fontSize: 16, fontWeight: 700,
                color: hiddenKeys.has(view.series[i].key) ? "#1A2744" : c.color,
                fontFamily: "'DM Mono', monospace",
                transition: "color 0.15s",
              }}>
                {c.current}{c.unit}
              </span>
              <span style={{ fontSize: 9, color: "#334155" }}>now</span>
              <span style={{ fontSize: 10, color: "#475569", marginLeft: 6 }}>
                peak: <strong style={{ color: c.color }}>{c.peak}{c.unit}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: "14px 14px 6px", position: "relative", minHeight: 0 }}>
        {/* Loading skeleton animation */}
        <style>{`
          @keyframes chartFadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .ic-chart-wrap { animation: chartFadeIn 0.35s ease; }
        `}</style>
        <div className="ic-chart-wrap" key={`${scenarioId}-${timeRange}`}>
          <SVGChart
            labels={view.labels}
            series={view.series}
            hiddenKeys={hiddenKeys}
            hoverIdx={hoverIdx}
            onHover={setHoverIdx}
          />
        </div>
        <ChartTooltip
          idx={hoverIdx}
          labels={view.labels}
          series={view.series}
          hiddenKeys={hiddenKeys}
        />
      </div>

      {/* ── Footer legend ────────────────────────────────────────── */}
      <div style={{
        padding: "8px 14px",
        borderTop: "1px solid #0F1E35",
        display: "flex", gap: 16, flexWrap: "wrap", flexShrink: 0,
      }}>
        {view.series.map((s) => (
          <div
            key={s.key}
            onClick={() => toggleSeries(s.key)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              cursor: "pointer", opacity: hiddenKeys.has(s.key) ? 0.35 : 1,
              transition: "opacity 0.15s",
            }}
          >
            <div style={{
              width: 20, height: 2.5, borderRadius: 2,
              background: s.fill
                ? `linear-gradient(90deg, ${s.color}, ${s.color}55)`
                : s.color,
            }} />
            <span style={{ fontSize: 9, color: "#475569", letterSpacing: "0.06em" }}>
              {s.label} {s.unit ? `(${s.unit})` : ""}
            </span>
          </div>
        ))}
        {view.series.some((s) => s.threshold) && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <div style={{ width: 16, height: 1.5, background: "#94A3B8", opacity: 0.6, borderTop: "1px dashed #94A3B8" }} />
            <span style={{ fontSize: 9, color: "#334155", letterSpacing: "0.06em" }}>Threshold</span>
          </div>
        )}
      </div>
    </div>
  );
}
