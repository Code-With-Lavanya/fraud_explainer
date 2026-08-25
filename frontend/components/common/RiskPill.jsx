import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { C, FONT_BODY, RISK } from "@/lib/constants";

export default function RiskPill({ level, size = "sm" }) {
  const map = {
    [RISK.LOW]: { c: C.low, bg: C.lowDim, Icon: ShieldCheck },
    [RISK.MEDIUM]: { c: C.med, bg: C.medDim, Icon: ShieldAlert },
    [RISK.HIGH]: { c: C.high, bg: C.highDim, Icon: ShieldX },
  };
  const m = map[level] || map[RISK.LOW];
  const pad = size === "lg" ? "6px 14px" : "3px 9px";
  const fs = size === "lg" ? 13 : 11;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: m.bg, color: m.c, border: `1px solid ${m.c}33`,
        borderRadius: 999, padding: pad, fontSize: fs, fontWeight: 600,
        fontFamily: FONT_BODY, letterSpacing: 0.3, whiteSpace: "nowrap",
      }}
    >
      <m.Icon size={size === "lg" ? 15 : 12} strokeWidth={2.4} />
      {level}
    </span>
  );
}
