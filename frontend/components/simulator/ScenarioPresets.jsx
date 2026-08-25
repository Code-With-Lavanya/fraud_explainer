import { FlaskConical, Play } from "lucide-react";
import { C, FONT_BODY, PRESETS } from "@/lib/constants";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";

export default function ScenarioPresets({ running, onRun }) {
  return (
    <Card style={{ padding: 18 }}>
      <SectionLabel icon={FlaskConical}>Scenario Presets</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            disabled={running}
            onClick={() => onRun(p.key)}
            style={{
              textAlign: "left", padding: "10px 11px", borderRadius: 8, border: `1px solid ${C.border}`,
              background: C.bg, cursor: running ? "not-allowed" : "pointer", opacity: running ? 0.5 : 1,
            }}
          >
            <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600, color: C.text }}>{p.label}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: C.textFaint, marginTop: 2 }}>{p.desc}</div>
          </button>
        ))}
      </div>
      <button
        disabled={running}
        onClick={() => onRun("takeover")}
        style={{
          marginTop: 12, width: "100%", padding: "11px", borderRadius: 8, border: "none",
          background: running ? "#1A2230" : `linear-gradient(135deg, ${C.high}, #C22F42)`, color: "#fff",
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13, cursor: running ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        <Play size={14} /> Simulate Fraudulent Transaction
      </button>
    </Card>
  );
}
