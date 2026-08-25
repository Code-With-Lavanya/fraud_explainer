import { Info, GitBranch } from "lucide-react";
import { C, FONT_BODY } from "@/lib/constants";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";

const STAGES = [
  "Transaction Event", "Feature Engineering", "Calibrated XGBoost", "Fraud Probability",
  "Risk Threshold", "Risk Level + Action", "SHAP", "Human-Readable Signals",
  "Gemini Explanation", "Frontend",
];

/*
 * Pairs the "why calibration" explanation with the decision pipeline
 * stage list, matching the original single-card layout.
 */
export default function DecisionPipeline() {
  return (
    <Card style={{ padding: 18 }}>
      <SectionLabel icon={Info}>Why Calibration?</SectionLabel>
      <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.textDim, lineHeight: 1.6, margin: 0 }}>
        Raw tree-model probabilities can be poorly calibrated — a score of 0.8 doesn&apos;t
        necessarily mean an 80% real-world likelihood of fraud. Calibration adjusts the
        output so the fraud probability is a more reliable, usable risk estimate for
        downstream thresholding and explanation.
      </p>
      <div style={{ height: 1, background: C.borderSoft, margin: "16px 0" }} />
      <SectionLabel icon={GitBranch}>Decision Pipeline</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {STAGES.map((s, i, arr) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_BODY, fontSize: 12, color: C.textDim }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent }} />
            {s}
            {i < arr.length - 1 && <span style={{ marginLeft: "auto", color: C.textFaint }}>↓</span>}
          </div>
        ))}
      </div>
    </Card>
  );
}
