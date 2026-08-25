import { C, RISK } from "@/lib/constants";

export default function ProbBar({ value, level }) {
  const map = { [RISK.LOW]: C.low, [RISK.MEDIUM]: C.med, [RISK.HIGH]: C.high };
  const col = map[level] || C.low;
  return (
    <div style={{ width: "100%", height: 5, background: "#1A2230", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, value * 100)}%`, height: "100%", background: col, transition: "width .6s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}
