/**
 * CausalGraph — renders arbitrary event graphs from {events[], edges[]} data.
 *
 * Layout algorithm:
 *  • BFS from root nodes to assign each node a "depth level"
 *  • Long linear chains (8 nodes, 1 per level) → dual-row zigzag
 *  • Branching / wide graphs → hierarchical left-to-right
 *
 * Props:
 *  graphData  — { events:[{id,name,type,detail}], edges:[{from,to}] }
 *  accentColor — hex string
 *
 * Falls back to linear sequence when graphData is missing.
 */
import { useState, useMemo } from "react";

// ── Layout engine ────────────────────────────────────────────────────────

function computeLayout(events, edges) {
  // Build adjacency maps
  const outEdges = {};
  const inDegree = {};
  events.forEach((e) => { outEdges[e.id] = []; inDegree[e.id] = 0; });
  edges.forEach(({ from, to }) => {
    outEdges[from]?.push(to);
    if (inDegree[to] !== undefined) inDegree[to]++;
  });

  // Root nodes = no incoming edges
  const roots = events.filter((e) => inDegree[e.id] === 0).map((e) => e.id);
  if (roots.length === 0 && events.length > 0) roots.push(events[0].id);

  // BFS to assign levels
  const levels = {};
  const queue = roots.map((id) => ({ id, level: 0 }));
  const visited = new Set();
  while (queue.length) {
    const { id, level } = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    levels[id] = level;
    (outEdges[id] || []).forEach((child) => {
      // push child with max-depth rule to handle diamonds
      if (!visited.has(child)) {
        queue.push({ id: child, level: level + 1 });
      } else {
        levels[child] = Math.max(levels[child] || 0, level + 1);
      }
    });
  }
  // Handle any nodes not visited (disconnected)
  events.forEach((e) => { if (levels[e.id] === undefined) levels[e.id] = 0; });

  // Group nodes by level
  const byLevel = {};
  events.forEach((e) => {
    const lv = levels[e.id];
    if (!byLevel[lv]) byLevel[lv] = [];
    byLevel[lv].push(e.id);
  });

  const maxLevel     = Math.max(...Object.keys(byLevel).map(Number));
  const maxPerLevel  = Math.max(...Object.values(byLevel).map((a) => a.length));
  const totalNodes   = events.length;
  const isLinear     = maxPerLevel === 1 && totalNodes > 4;

  // ── Dual-row zigzag for long linear chains ───────────────────────────
  if (isLinear) {
    const SVG_W = 960, SVG_H = 320;
    const nodeR  = 38;
    const nodeIds = events.map((e) => e.id); // ordered by original array
    const half    = Math.ceil(nodeIds.length / 2);
    const positions = {};

    // Top row: even indices (0,2,4,6…), bottom row: odd indices (1,3,5,7…)
    const topNodes = nodeIds.filter((_, i) => i % 2 === 0);
    const botNodes = nodeIds.filter((_, i) => i % 2 === 1);
    const colCount = Math.max(topNodes.length, botNodes.length);
    const xStep    = (SVG_W - 160) / Math.max(colCount - 1, 1);

    topNodes.forEach((id, i) => {
      positions[id] = { x: 80 + i * xStep, y: 100 };
    });
    botNodes.forEach((id, i) => {
      // Offset by half xStep so it sits between the top nodes
      positions[id] = { x: 80 + xStep / 2 + i * xStep, y: 230 };
    });

    return { positions, SVG_W, SVG_H, nodeR, isLinear: true };
  }

  // ── Hierarchical left-to-right for branching graphs ─────────────────
  const SVG_W  = 800;
  const nodeR  = 40;
  const SVG_H  = Math.max(280, (maxPerLevel + 1) * 100 + 40);

  const positions = {};
  Object.entries(byLevel).forEach(([lv, ids]) => {
    const level  = parseInt(lv);
    const x      = maxLevel === 0 ? SVG_W / 2 : 80 + (level / maxLevel) * (SVG_W - 160);
    const yStep  = SVG_H / (ids.length + 1);
    ids.forEach((id, i) => {
      positions[id] = { x, y: yStep * (i + 1) };
    });
  });

  return { positions, SVG_W, SVG_H, nodeR, isLinear: false };
}

// ── Node type colour helpers ─────────────────────────────────────────────

function typeLabel(type) {
  if (type === "cause")  return "ROOT CAUSE";
  if (type === "impact") return "IMPACT";
  return null;
}

// ── Main component ───────────────────────────────────────────────────────

export default function CausalGraph({ graphData, accentColor }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [activeId,  setActiveId]  = useState(null);

  // Normalise — graphData is the new JSON format
  const events = graphData?.events || [];
  const edges  = graphData?.edges  || [];

  const { positions, SVG_W, SVG_H, nodeR } = useMemo(
    () => computeLayout(events, edges),
    [events, edges]
  );

  // Build lookup
  const eventById = {};
  events.forEach((e) => { eventById[e.id] = e; });

  const activeEvent = activeId !== null ? eventById[activeId] : null;

  if (events.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#2D4A6B", fontSize: 12 }}>
        No graph data available for this scenario.
      </div>
    );
  }

  // ── Node colour by type ──────────────────────────────────────────────
  const nodeColor = (e) => {
    if (e.type === "cause")  return "#EF4444";   // red  — root cause
    if (e.type === "impact") return "#F97316";   // orange — impact
    return accentColor;                           // accent — intermediate
  };

  // ── Truncate label ───────────────────────────────────────────────────
  const short = (s, max = 13) => s.length > max ? s.slice(0, max - 1) + "…" : s;

  return (
    <div style={{ position: "relative" }}>
      <style>{`
        @keyframes pulseRingG {
          0%   { opacity: 0.7; }
          100% { opacity: 0;   }
        }
        .graph-pulse { animation: pulseRingG 1.5s ease-out infinite; }

        @keyframes nodeLoad {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }

        @keyframes edgeLoad {
          from { stroke-dashoffset: 300; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* ── Legend ───────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 20, marginBottom: 14, flexWrap: "wrap" }}>
        {[
          { color: "#EF4444", label: "Root Cause" },
          { color: accentColor, label: "Intermediate Event" },
          { color: "#F97316",  label: "Impact" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{
              width: 10, height: 10, borderRadius: "50%",
              background: item.color, boxShadow: `0 0 6px ${item.color}80`,
            }} />
            <span style={{ fontSize: 10, color: "#2D4A6B", letterSpacing: "0.06em" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── SVG Canvas ───────────────────────────────────────────── */}
      <div style={{ overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ width: "100%", minWidth: Math.min(SVG_W, 520), height: "auto", display: "block" }}
        >
          <defs>
            <marker id="arrowG" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill={accentColor} opacity="0.8" />
            </marker>
            <marker id="arrowGHot" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#F1F5F9" opacity="0.9" />
            </marker>
            <filter id="glowSoft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glowStrong" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="9" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── Edges ─────────────────────────────────────────────── */}
          {edges.map((edge, idx) => {
            const from = positions[edge.from];
            const to   = positions[edge.to];
            if (!from || !to) return null;

            const dx  = to.x - from.x;
            const dy  = to.y - from.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const ux  = dx / len, uy = dy / len;
            const isHot = hoveredId === edge.from || hoveredId === edge.to;

            return (
              <line
                key={`edge-${idx}`}
                x1={from.x + ux * (nodeR + 2)}
                y1={from.y + uy * (nodeR + 2)}
                x2={to.x   - ux * (nodeR + 7)}
                y2={to.y   - uy * (nodeR + 7)}
                stroke={isHot ? "#F1F5F9" : accentColor}
                strokeWidth={isHot ? 2 : 1.5}
                strokeDasharray={isHot ? "none" : "6,4"}
                opacity={isHot ? 0.9 : 0.45}
                markerEnd={isHot ? "url(#arrowGHot)" : "url(#arrowG)"}
                style={{ transition: "opacity 0.2s, stroke-width 0.2s" }}
              />
            );
          })}

          {/* ── Nodes ─────────────────────────────────────────────── */}
          {events.map((evt, idx) => {
            const pos      = positions[evt.id];
            if (!pos) return null;
            const isHov    = hoveredId === evt.id;
            const isActive = activeId  === evt.id;
            const color    = nodeColor(evt);
            const tag      = typeLabel(evt.type);

            return (
              <g
                key={evt.id}
                style={{ cursor: "pointer", animation: `nodeLoad 0.4s ease ${idx * 60}ms both` }}
                onMouseEnter={() => setHoveredId(evt.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setActiveId(isActive ? null : evt.id)}
              >
                {/* Pulse ring for active */}
                {isActive && (
                  <circle
                    cx={pos.x} cy={pos.y} r={nodeR + 12}
                    fill={`${color}10`} stroke={color} strokeWidth="1.5"
                    className="graph-pulse"
                  />
                )}

                {/* Hover glow ring */}
                {isHov && (
                  <circle
                    cx={pos.x} cy={pos.y} r={nodeR + 9}
                    fill={`${color}0C`} stroke={`${color}35`} strokeWidth="1"
                  />
                )}

                {/* Main circle */}
                <circle
                  cx={pos.x} cy={pos.y} r={nodeR}
                  fill={isActive ? `${color}22` : isHov ? `${color}16` : "#0B1628"}
                  stroke={color}
                  strokeWidth={isActive ? 2.5 : isHov ? 2 : 1.5}
                  filter={isHov || isActive ? "url(#glowStrong)" : "url(#glowSoft)"}
                  style={{ transition: "fill 0.2s, stroke-width 0.2s" }}
                />

                {/* Inner accent ring */}
                <circle
                  cx={pos.x} cy={pos.y} r={nodeR - 7}
                  fill="none" stroke={color} strokeWidth="0.5"
                  opacity={isHov ? 0.45 : 0.12}
                />

                {/* Type tag badge (ROOT CAUSE / IMPACT) */}
                {tag && (
                  <text
                    x={pos.x} y={pos.y - (nodeR + 6)}
                    textAnchor="middle" fontSize="6.5"
                    fill={color} fontWeight="800"
                    letterSpacing="0.1em"
                    fontFamily="'DM Mono', monospace"
                    opacity="0.85"
                  >
                    {tag}
                  </text>
                )}

                {/* Event name (up to 2 lines via manual break) */}
                {(() => {
                  const words  = evt.name.split(" ");
                  const mid    = Math.ceil(words.length / 2);
                  const line1  = words.slice(0, mid).join(" ");
                  const line2  = words.slice(mid).join(" ");
                  const bright = isHov || isActive ? "#F1F5F9" : "#CBD5E1";
                  return (
                    <>
                      <text
                        x={pos.x} y={pos.y - (line2 ? 4 : 2)}
                        textAnchor="middle" fontSize="7.5"
                        fill={bright} fontWeight="600"
                        fontFamily="'DM Sans', sans-serif"
                        style={{ transition: "fill 0.15s" }}
                      >
                        {line1}
                      </text>
                      {line2 && (
                        <text
                          x={pos.x} y={pos.y + 9}
                          textAnchor="middle" fontSize="7.5"
                          fill={bright} fontWeight="600"
                          fontFamily="'DM Sans', sans-serif"
                        >
                          {line2}
                        </text>
                      )}
                    </>
                  );
                })()}

                {/* Node ID number */}
                <text
                  x={pos.x} y={pos.y + (evt.name.split(" ").length > 2 ? 22 : 19)}
                  textAnchor="middle" fontSize="7"
                  fill={color} opacity="0.55"
                  fontFamily="'DM Mono', monospace" fontWeight="600"
                >
                  {String(evt.id).padStart(2, "0")}
                </text>

                {/* Click hint on hover */}
                {isHov && !isActive && (
                  <text
                    x={pos.x} y={pos.y + (nodeR + 18)}
                    textAnchor="middle" fontSize="6"
                    fill={color} opacity="0.5"
                    fontFamily="'DM Sans', sans-serif"
                  >
                    click for details
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Node detail popup ─────────────────────────────────────── */}
      {activeEvent && (
        <div
          style={{
            marginTop: 16,
            background: "#060C18",
            border: `1px solid ${nodeColor(activeEvent)}45`,
            borderRadius: 12,
            overflow: "hidden",
            animation: "fadeSlideIn 0.2s ease",
            boxShadow: `0 0 28px ${nodeColor(activeEvent)}12`,
          }}
        >
          <style>{`
            @keyframes fadeSlideIn {
              from { opacity: 0; transform: translateY(-8px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Popup header */}
          <div style={{
            padding: "13px 20px",
            borderBottom: `1px solid ${nodeColor(activeEvent)}20`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: `linear-gradient(90deg, ${nodeColor(activeEvent)}0C 0%, transparent 80%)`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{
                width: 30, height: 30, borderRadius: "50%",
                border: `1.5px solid ${nodeColor(activeEvent)}`,
                background: `${nodeColor(activeEvent)}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: nodeColor(activeEvent),
              }}>
                {String(activeEvent.id).padStart(2, "0")}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>
                  {activeEvent.name}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: "#334155", letterSpacing: "0.06em" }}>
                  {activeEvent.type === "cause"
                    ? "ROOT CAUSE — Primary trigger of cascade"
                    : activeEvent.type === "impact"
                    ? "TERMINAL IMPACT — Final downstream consequence"
                    : "INTERMEDIATE EVENT — Caused and causal"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveId(null)}
              style={{
                background: "none", border: "1px solid #1E293B",
                color: "#475569", cursor: "pointer", borderRadius: 6,
                padding: "5px 12px", fontSize: 11, fontFamily: "inherit",
              }}
            >
              ✕
            </button>
          </div>

          {/* Popup body */}
          <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px 22px" }}>
            {[
              { label: "Event Name",     value: activeEvent.name },
              { label: "Event Type",     value: activeEvent.type?.toUpperCase() || "—" },
              { label: "Node ID",        value: `Node #${activeEvent.id}` },
              { label: "Impact Description", value: activeEvent.detail || "—", span: 3 },
              {
                label: "Chain Position",
                value: activeEvent.type === "cause"
                  ? `Starting node — triggers ${edges.filter(e => e.from === activeEvent.id).length} downstream event(s)`
                  : activeEvent.type === "impact"
                  ? `End node — receives ${edges.filter(e => e.to === activeEvent.id).length} upstream trigger(s)`
                  : `Intermediate — ${edges.filter(e => e.from === activeEvent.id).length} outgoing, ${edges.filter(e => e.to === activeEvent.id).length} incoming`,
                span: 3,
              },
            ].map((cell) => (
              <div key={cell.label} style={{ gridColumn: cell.span ? `span ${cell.span}` : "span 1" }}>
                <p style={{
                  margin: "0 0 5px", fontSize: 9, fontWeight: 700,
                  color: nodeColor(activeEvent), letterSpacing: "0.13em", textTransform: "uppercase",
                }}>
                  {cell.label}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: "#CBD5E1", lineHeight: 1.55 }}>
                  {cell.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
