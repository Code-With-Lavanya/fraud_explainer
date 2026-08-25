"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio } from "lucide-react";
import { C, FONT_HEAD, FONT_BODY, FONT_MONO, NAV_ITEMS } from "@/lib/constants";
import { useTransactions } from "@/hooks/useTransactions";

export default function Sidebar() {
  const pathname = usePathname();
  const { systemOnline } = useTransactions();

  return (
    <div
      style={{
        width: 216, flexShrink: 0, background: C.bgGrid, borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column", padding: "20px 14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 8px 22px", borderBottom: `1px solid ${C.borderSoft}`, marginBottom: 18 }}>
        <div
          style={{
            width: 30, height: 30, borderRadius: 8, background: `linear-gradient(145deg, ${C.accentDim}, #0A1319)`,
            border: `1px solid ${C.accent}55`, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Radio size={15} color={C.accent} strokeWidth={2.3} />
        </div>
        <div>
          <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13.5, color: C.text, lineHeight: 1.1 }}>Fraud Explainer</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: C.textFaint, letterSpacing: 0.6 }}>REAL-TIME ENGINE</div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 7,
                background: active ? "#152029" : "transparent",
                color: active ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT_BODY,
                fontSize: 13, fontWeight: 500, textAlign: "left", textDecoration: "none", transition: "all .15s",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#0F151E"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <item.icon size={15} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", padding: "10px 10px 4px", borderTop: `1px solid ${C.borderSoft}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: FONT_MONO, fontSize: 10.5, color: systemOnline ? C.low : C.high }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: systemOnline ? C.low : C.high, boxShadow: `0 0 6px ${systemOnline ? C.low : C.high}` }} />
          {systemOnline ? "FRAUD ENGINE ONLINE" : "FRAUD ENGINE UNAVAILABLE"}
        </div>
      </div>
    </div>
  );
}
