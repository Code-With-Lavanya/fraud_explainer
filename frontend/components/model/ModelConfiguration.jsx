import { Brain } from "lucide-react";
import { C, FONT_BODY, FONT_MONO } from "@/lib/constants";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";

const ROWS = [
  ["Model", "Calibrated XGBoost"],
  ["Alternative Evaluated", "Random Forest"],
  ["Probability Calibration", "Applied to raw tree-model output"],
  ["Decision Threshold", "0.40"],
  ["Interpretability", "SHAP"],
  ["Explanation Layer", "Gemini (LLM)"],
];

export default function ModelConfiguration() {
  return (
    <Card style={{ padding: 18 }}>
      <SectionLabel icon={Brain}>Model Configuration</SectionLabel>
      {ROWS.map(([k, v], i) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < ROWS.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.textDim }}>{k}</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 12.5, color: C.text }}>{v}</span>
        </div>
      ))}
    </Card>
  );
}
