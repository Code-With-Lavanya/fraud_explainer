import { C, FONT_MONO, RISK } from "@/lib/constants";

const FILTERS = ["ALL", RISK.LOW, RISK.MEDIUM, RISK.HIGH];

export default function TransactionFilters({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            padding: "6px 13px", borderRadius: 7, border: `1px solid ${value === f ? C.accent : C.border}`,
            background: value === f ? "#132229" : "transparent", color: value === f ? C.accent : C.textDim,
            fontFamily: FONT_MONO, fontSize: 11, cursor: "pointer",
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
