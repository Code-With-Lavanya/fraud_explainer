import { ShieldCheck, Gauge, BarChart3, Zap } from "lucide-react";
import { C, FONT_HEAD, FONT_BODY } from "@/lib/constants";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";

const BLOCKS = [
  { title: "ML Model", desc: "Makes the fraud prediction from engineered behavioral features.", icon: Gauge },
  { title: "SHAP", desc: "Explains which signals contributed most to the model's decision.", icon: BarChart3 },
  { title: "Gemini", desc: "Converts technical model signals into a human-readable explanation.", icon: Zap },
];

export default function ResponsibilitySplit() {
  return (
    <Card style={{ padding: 18, marginTop: 16 }}>
      <SectionLabel icon={ShieldCheck}>Responsibility Split</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {BLOCKS.map((b) => (
          <div key={b.title} style={{ padding: 14, background: C.bg, border: `1px solid ${C.borderSoft}`, borderRadius: 8 }}>
            <b.icon size={16} color={C.accent} />
            <div style={{ fontFamily: FONT_HEAD, fontSize: 13.5, fontWeight: 700, color: C.text, marginTop: 8 }}>{b.title}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.textDim, marginTop: 4, lineHeight: 1.5 }}>{b.desc}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
