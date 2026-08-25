import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { C, FONT_BODY } from "@/lib/constants";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";

/**
 * `data` is a real aggregate built (in app/analytics/page.jsx) from the
 * SHAP contributions the backend actually returned for each scored
 * transaction this session — not a hardcoded illustrative ranking.
 * It will be empty/sparse until enough real transactions exist.
 */
export default function FraudIndicatorsChart({ data }) {
  const hasData = data && data.length > 0;

  return (
    <Card style={{ padding: 18 }}>
      <SectionLabel icon={TrendingUp}>Top Fraud Indicators</SectionLabel>
      {hasData ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid stroke={C.borderSoft} horizontal={false} />
            <XAxis type="number" tick={{ fill: C.textFaint, fontSize: 10 }} axisLine={{ stroke: C.border }} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: C.textDim, fontSize: 11 }} axisLine={{ stroke: C.border }} tickLine={false} width={120} />
            <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="value" fill={C.high} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_BODY, fontSize: 12.5, color: C.textFaint, textAlign: "center", padding: "0 20px" }}>
          Aggregated from live SHAP contributions — will populate as transactions are scored.
        </div>
      )}
    </Card>
  );
}
