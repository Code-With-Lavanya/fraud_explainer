import { C, FONT_HEAD, FONT_BODY, FONT_MONO } from "@/lib/constants";
import Card from "@/components/common/Card";

export default function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <Card style={{ padding: "16px 18px", flex: 1, minWidth: 150 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, letterSpacing: 1, color: C.textFaint, textTransform: "uppercase" }}>{label}</span>
        <Icon size={14} color={accent || C.textFaint} />
      </div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 26, fontWeight: 700, color: C.text, marginTop: 8 }}>{value}</div>
      {sub && <div style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.textDim, marginTop: 3 }}>{sub}</div>}
    </Card>
  );
}
