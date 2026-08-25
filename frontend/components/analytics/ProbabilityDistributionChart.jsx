import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Gauge } from "lucide-react";
import { C } from "@/lib/constants";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";

export default function ProbabilityDistributionChart({ data }) {
  return (
    <Card style={{ padding: 18 }}>
      <SectionLabel icon={Gauge}>Fraud Probability Distribution</SectionLabel>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid stroke={C.borderSoft} vertical={false} />
          <XAxis dataKey="range" tick={{ fill: C.textFaint, fontSize: 9 }} axisLine={{ stroke: C.border }} tickLine={false} interval={1} />
          <YAxis tick={{ fill: C.textFaint, fontSize: 10 }} axisLine={{ stroke: C.border }} tickLine={false} />
          <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey="count" fill={C.accent} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
