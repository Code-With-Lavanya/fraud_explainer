import { Gauge } from "lucide-react";
import { C, FONT_HEAD, FONT_BODY, FONT_MONO, RISK } from "@/lib/constants";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";
import RiskPill from "@/components/common/RiskPill";
import ActionPill from "@/components/common/ActionPill";

export default function SimulationResult({ result }) {
  if (!result) return null;

  return (
    <Card style={{ padding: 18, marginTop: 16, borderColor: result.riskLevel === RISK.HIGH ? C.high + "55" : C.border }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <SectionLabel icon={Gauge}>Transaction Analysis Complete</SectionLabel>
        <RiskPill level={result.riskLevel} size="lg" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint }}>FRAUD PROBABILITY</div>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 700, color: C.text }}>{(result.fraudProbability * 100).toFixed(2)}%</div>
        </div>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint }}>RECOMMENDED ACTION</div>
          <div style={{ marginTop: 4 }}>
            <ActionPill action={result.action} />
          </div>
        </div>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint }}>SCENARIO</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.text, marginTop: 2 }}>{result.id}</div>
        </div>
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.text, lineHeight: 1.55, background: C.bg, border: `1px solid ${C.borderSoft}`, borderRadius: 8, padding: 12 }}>
        {result.aiSummary.summary}
      </div>
    </Card>
  );
}
