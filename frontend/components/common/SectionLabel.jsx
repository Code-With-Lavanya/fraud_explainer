import { C, FONT_MONO } from "@/lib/constants";

export default function SectionLabel({ children, icon: Icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      {Icon && <Icon size={14} color={C.accent} />}
      <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.6, color: C.textDim, textTransform: "uppercase" }}>
        {children}
      </span>
    </div>
  );
}
