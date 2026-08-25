import { C, FONT_BODY, FONT_MONO } from "@/lib/constants";

const STAGES = ["Event", "Features", "XGBoost", "SHAP", "Gemini", "Decision"];

export default function MiniPipeline() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {STAGES.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 18, height: 18, borderRadius: 5, background: "#152029", border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_MONO, fontSize: 9.5, color: C.accent,
            }}
          >
            {i + 1}
          </span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.textDim }}>{s}</span>
        </div>
      ))}
    </div>
  );
}
