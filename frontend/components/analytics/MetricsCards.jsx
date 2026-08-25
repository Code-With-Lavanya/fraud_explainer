import { C, FONT_HEAD, FONT_MONO } from "@/lib/constants";
import Card from "@/components/common/Card";

/*
 * ============================================================
 * NOT CURRENTLY RENDERED — no real source for these figures
 * ============================================================
 * These ROC-AUC/PR-AUC/Precision/Recall/F1 values were hardcoded and
 * are not sourced from anywhere in the backend: there's no
 * ground-truth-labeled evaluation set anywhere in this app to compute
 * them from (this is a live scoring demo, not a labeled test set), and
 * no metrics artifact is loaded alongside the model
 * (fraud_model_calibrated.joblib / feature_columns.joblib /
 * fraud_threshold.joblib — no metrics file). Removed from
 * app/analytics/page.jsx rather than left showing fabricated numbers.
 * If real offline evaluation metrics become available (e.g. saved
 * alongside the model artifacts at training time), wire them through
 * a backend field and reintroduce this component with real data.
 */
const METRICS = [
  { label: "ROC-AUC", value: "0.9948" },
  { label: "PR-AUC", value: "0.9660" },
  { label: "Precision", value: "0.95" },
  { label: "Recall", value: "0.89" },
  { label: "F1-Score", value: "0.92" },
];

export default function MetricsCards() {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
      {METRICS.map((m) => (
        <Card key={m.label} style={{ padding: "12px 18px", flex: 1, minWidth: 110 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint, letterSpacing: 0.6 }}>{m.label.toUpperCase()}</div>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 20, fontWeight: 700, color: C.accent, marginTop: 4 }}>{m.value}</div>
        </Card>
      ))}
    </div>
  );
}
