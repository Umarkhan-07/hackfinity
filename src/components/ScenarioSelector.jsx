/**
 * ScenarioSelector — compact active-scenario strip (shown after selection)
 */
export default function ScenarioSelector({ scenarios, selected, onSelect, disabled }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {scenarios.map((sc) => {
        const active = selected === sc.id;
        return (
          <button
            key={sc.id}
            onClick={() => onSelect(sc.id)}
            disabled={disabled}
            style={{
              padding: "9px 20px",
              borderRadius: 6,
              border: `1px solid ${active ? sc.color : "#1E293B"}`,
              background: active ? `${sc.color}18` : "transparent",
              color: active ? sc.color : "#475569",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: active ? 700 : 500,
              cursor: disabled ? "not-allowed" : "pointer",
              letterSpacing: "0.04em",
              transition: "all 0.18s ease",
              outline: "none",
              opacity: disabled && !active ? 0.5 : 1,
              boxShadow: active ? `0 0 12px ${sc.color}25` : "none",
            }}
          >
            {sc.label}
          </button>
        );
      })}
    </div>
  );
}
