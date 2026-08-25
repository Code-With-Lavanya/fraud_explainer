import {
  AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";
import { C } from "@/lib/constants";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";

export default function TransactionTrendChart({ data }) {
  return (
    <Card style={{ padding: 18 }}>
      <SectionLabel icon={LineChartIcon}>Transactions Over Time</SectionLabel>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="txnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.accent} stopOpacity={0.4} />
              <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={C.borderSoft} vertical={false} />
          <XAxis dataKey="hour" tick={{ fill: C.textFaint, fontSize: 10 }} axisLine={{ stroke: C.border }} tickLine={false} />
          <YAxis tick={{ fill: C.textFaint, fontSize: 10 }} axisLine={{ stroke: C.border }} tickLine={false} />
          <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
          <Area type="monotone" dataKey="txns" stroke={C.accent} fill="url(#txnGrad)" strokeWidth={2} name="Transactions" />
          <Line type="monotone" dataKey="fraud" stroke={C.high} strokeWidth={2} dot={false} name="Fraud" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
