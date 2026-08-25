import { User } from "lucide-react";
import { C, FONT_HEAD, FONT_BODY, FONT_MONO } from "@/lib/constants";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";

const TEAM = [
  { name: "Aman", role: "2nd Year B.Tech", org: "VIPS" },
  { name: "Sasang", role: "2nd Year B.Tech", org: "DTU" },
  { name: "Lavanya", role: "2nd Year B.Com (Hons)", org: "DU" },
];

export default function TeamSection() {
  return (
    <>
      <SectionLabel icon={User}>Team</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {TEAM.map((t) => (
          <Card key={t.name} style={{ padding: 18 }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: "50%", background: C.accentDim, border: `1px solid ${C.accent}55`,
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEAD, fontWeight: 700, color: C.accent, fontSize: 16,
              }}
            >
              {t.name[0]}
            </div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 700, color: C.text, marginTop: 10 }}>{t.name}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.textDim, marginTop: 2 }}>{t.role}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textFaint, marginTop: 2 }}>{t.org}</div>
          </Card>
        ))}
      </div>
    </>
  );
}
