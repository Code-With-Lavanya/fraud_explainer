import { C, FONT_HEAD, FONT_BODY, FONT_MONO } from "@/lib/constants";
import Card from "@/components/common/Card";
import TeamSection from "@/components/about/TeamSection";

export default function AboutPage() {
  return (
    <div>
      <h1 style={{ fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>About</h1>
      <Card style={{ padding: 20, marginTop: 14, marginBottom: 18 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.accent, letterSpacing: 1.2 }}>REAL-TIME FRAUD EXPLAINER</div>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: C.textDim, lineHeight: 1.65, marginTop: 8, maxWidth: 640 }}>
          An AI-powered transaction fraud detection and explanation system combining machine
          learning, behavioral analysis, explainable AI, and LLM-based explanations.
        </p>
      </Card>

      <TeamSection />
    </div>
  );
}
