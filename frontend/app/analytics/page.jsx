"use client";

import { useEffect, useState } from "react";
import { C, FONT_HEAD, FONT_BODY, RISK } from "@/lib/constants";
import { useTransactions } from "@/hooks/useTransactions";
import TransactionTrendChart from "@/components/analytics/TransactionTrendChart";
import RiskDistributionChart from "@/components/analytics/RiskDistributionChart";
import ProbabilityDistributionChart from "@/components/analytics/ProbabilityDistributionChart";
import FraudIndicatorsChart from "@/components/analytics/FraudIndicatorsChart";

/*
 * Every chart below is now built exclusively from the real
 * `transactions` this session — no Math.random() trend data, no
 * seedTransactions() padding, no hardcoded ROC-AUC/precision/recall/
 * false-positive/false-negative figures. Those numbers had no source
 * anywhere in the backend (no ground-truth labels exist in this app
 * to compute them from), so rather than substitute an equally-fake
 * placeholder, they've been removed. Charts will look sparse until
 * enough real transactions have been scored — that's expected.
 */

function buildTimeSeries(transactions) {
  const buckets = Array.from({ length: 12 }, (_, h) => ({ hour: `${h * 2}:00`, txns: 0, fraud: 0 }));
  transactions.forEach((t) => {
    if (!(t.timestamp instanceof Date) || Number.isNaN(t.timestamp.getTime())) return;
    const idx = Math.min(11, Math.floor(t.timestamp.getHours() / 2));
    buckets[idx].txns += 1;
    if (t.riskLevel === RISK.HIGH) buckets[idx].fraud += 1;
  });
  return buckets;
}

function buildProbBuckets(transactions) {
  const buckets = Array.from({ length: 10 }, (_, i) => ({ range: `${i * 10}-${i * 10 + 10}%`, count: 0 }));
  transactions.forEach((t) => {
    const idx = Math.min(9, Math.max(0, Math.floor((t.fraudProbability ?? 0) * 10)));
    buckets[idx].count++;
  });
  return buckets;
}

function buildTopIndicators(transactions) {
  const totals = new Map();
  transactions.forEach((t) => {
    (t.shap || []).forEach((s) => {
      if (s.value <= 0) return; // only risk-increasing contributions
      totals.set(s.label, (totals.get(s.label) || 0) + s.value);
    });
  });
  return Array.from(totals.entries())
    .map(([name, value]) => ({ name, value: +value.toFixed(3) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

export default function AnalyticsPage() {
  const { transactions } = useTransactions();

  // Recharts' ResponsiveContainer needs a real browser to size itself,
  // so these are computed inside useEffect (client-only) rather than
  // during render, avoiding a hydration mismatch — same pattern as
  // before, just fed by real data instead of Math.random()/mock seeds.
  const [timeSeries, setTimeSeries] = useState([]);
  const [probBuckets, setProbBuckets] = useState([]);
  const [topIndicators, setTopIndicators] = useState([]);

  useEffect(() => {
    setTimeSeries(buildTimeSeries(transactions));
    setProbBuckets(buildProbBuckets(transactions));
    setTopIndicators(buildTopIndicators(transactions));
  }, [transactions]);

  return (
    <div>
      <h1 style={{ fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Analytics</h1>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textDim, margin: "0 0 18px" }}>
        Live fraud pattern insights from transactions scored this session.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 16 }}>
        <TransactionTrendChart data={timeSeries} />
        <RiskDistributionChart transactions={transactions} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ProbabilityDistributionChart data={probBuckets} />
        <FraudIndicatorsChart data={topIndicators} />
      </div>
    </div>
  );
}
