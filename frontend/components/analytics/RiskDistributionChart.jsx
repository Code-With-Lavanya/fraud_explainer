import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";
import { C, FONT_BODY, RISK } from "@/lib/constants";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";

export default function RiskDistributionChart({ transactions }) {
  // Real live-session counts only — no baseline padding.
  const dist = [
    { name: "Low", value: transactions.filter((t) => t.riskLevel === RISK.LOW).length, color: C.low },
    { name: "Medium", value: transactions.filter((t) => t.riskLevel === RISK.MEDIUM).length, color: C.med },
    { name: "High", value: transactions.filter((t) => t.riskLevel === RISK.HIGH).length, color: C.high },
  ];
  const hasData = dist.some((d) => d.value > 0);

  return (
    <Card style={{ padding: 18 }}>
      <SectionLabel icon={BarChart3}>Risk Distribution</SectionLabel>
      {hasData ? (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={dist} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
              {dist.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: FONT_BODY, color: C.textDim }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_BODY, fontSize: 12.5, color: C.textFaint, textAlign: "center", padding: "0 20px" }}>
          No scored transactions yet this session.
        </div>
      )}
    </Card>
  );
}
