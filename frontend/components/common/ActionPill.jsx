import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { C, FONT_MONO, ACTION } from "@/lib/constants";

export default function ActionPill({ action }) {
  const map = {
    [ACTION.GO]: { c: C.low, Icon: CheckCircle2 },
    [ACTION.VERIFY]: { c: C.med, Icon: AlertTriangle },
    [ACTION.PAUSE]: { c: C.high, Icon: XCircle },
  };
  const m = map[action] || map[ACTION.GO];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: m.c, fontFamily: FONT_MONO, fontSize: 11.5, fontWeight: 600, letterSpacing: 0.4 }}>
      <m.Icon size={13} /> {action}
    </span>
  );
}
