import { ArrowRight, ChevronRight } from "lucide-react";
import { C, FONT_BODY, FONT_MONO } from "@/lib/constants";
import { fmtTime } from "@/lib/utils";
import RiskPill from "@/components/common/RiskPill";
import ActionPill from "@/components/common/ActionPill";
import ProbBar from "@/components/common/ProbBar";

export default function TransactionRow({ t, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "grid", gridTemplateColumns: "1.6fr 0.9fr 0.9fr 1fr 1fr 1fr auto",
        alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: `1px solid ${C.borderSoft}`,
        cursor: "pointer", transition: "background .12s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#0F151F")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_BODY, fontSize: 13, color: C.text, minWidth: 0 }}>
        <span style={{ fontWeight: 600 }}>{t.sender}</span>
        <ArrowRight size={12} color={C.textFaint} />
        <span style={{ color: C.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.recipient}</span>
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 12.5, color: C.text }}>₹{t.amount.toLocaleString("en-IN")}</div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: C.textFaint }}>{fmtTime(t.timestamp)}</div>
      <div>
        <RiskPill level={t.riskLevel} />
      </div>
      <div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.text, marginBottom: 3 }}>{(t.fraudProbability * 100).toFixed(2)}%</div>
        <ProbBar value={t.fraudProbability} level={t.riskLevel} />
      </div>
      <div>
        <ActionPill action={t.action} />
      </div>
      <ChevronRight size={15} color={C.textFaint} />
    </div>
  );
}
