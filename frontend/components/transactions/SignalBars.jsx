import { C, FONT_BODY } from "@/lib/constants";

export default function SignalBars({ signals, dir }) {
  const col = dir === "up" ? C.high : C.low;
  // The real backend returns risk signals as plain sentences with no
  // per-signal weight (unlike the old mock's SIGNAL_LIBRARY). Falling
  // back to 1 renders every real signal as a full, equal-length bar —
  // showing presence honestly rather than inventing a relative magnitude
  // the backend never provided.
  const max = Math.max(...signals.map((s) => s.weight ?? 1), 0.01);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {signals.map((s) => (
        <div key={s.key}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT_BODY, fontSize: 11.5, color: C.textDim, marginBottom: 3 }}>
            <span>{s.label}</span>
          </div>
          <div style={{ height: 6, background: "#161E29", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${((s.weight ?? 1) / max) * 100}%`, height: "100%", background: col }} />
          </div>
        </div>
      ))}
    </div>
  );
}
