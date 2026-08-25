import { C, FONT_HEAD, FONT_BODY } from "@/lib/constants";
import ModelConfiguration from "@/components/model/ModelConfiguration";
import DecisionPipeline from "@/components/model/DecisionPipeline";
import ResponsibilitySplit from "@/components/model/ResponsibilitySplit";

export default function ModelPage() {
  return (
    <div>
      <h1 style={{ fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Model Insights</h1>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textDim, margin: "0 0 18px" }}>How the fraud engine makes and explains its decisions.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ModelConfiguration />
        <DecisionPipeline />
      </div>

      <ResponsibilitySplit />
    </div>
  );
}
