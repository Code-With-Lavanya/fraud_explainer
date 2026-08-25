"use client";

import { Activity, List, ShieldX, ShieldAlert, Gauge, Zap, BarChart3, GitBranch, AlertTriangle } from "lucide-react";
import { C, FONT_HEAD, FONT_BODY, FONT_MONO, RISK } from "@/lib/constants";
import { useTransactions } from "@/hooks/useTransactions";
import Card from "@/components/common/Card";
import SectionLabel from "@/components/common/SectionLabel";
import DistributionBar from "@/components/common/DistributionBar";
import StatCard from "@/components/dashboard/StatCard";
import MiniPipeline from "@/components/dashboard/MiniPipeline";
import TransactionTable from "@/components/transactions/TransactionTable";

export default function DashboardPage() {
  const { transactions, transactionsLoading, transactionsError, systemOnline, openTxn, refetchTransactions } = useTransactions();

  // Real live-session counts only — no baseline padding. This will look
  // sparse until real transactions have been scored, which is expected.
  const monitored = transactions.length;
  const fraudCount = transactions.filter((t) => t.riskLevel === RISK.HIGH).length;
  const highRisk = transactions.filter((t) => t.riskLevel !== RISK.LOW).length;
  const avgProb = transactions.length
    ? transactions.reduce((s, t) => s + t.fraudProbability, 0) / transactions.length
    : 0;

  const dist = {
    low: transactions.filter((t) => t.riskLevel === RISK.LOW).length,
    med: transactions.filter((t) => t.riskLevel === RISK.MEDIUM).length,
    high: transactions.filter((t) => t.riskLevel === RISK.HIGH).length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <h1 style={{ fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Fraud Monitoring Dashboard</h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textDim, marginTop: 4 }}>
          Live view of transaction risk across the payment network.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard label="System Status" value={systemOnline ? "ONLINE" : "OFFLINE"} icon={Activity} accent={systemOnline ? C.low : C.high} sub="Fraud engine heartbeat" />
        <StatCard label="Transactions Monitored" value={monitored.toLocaleString("en-IN")} icon={List} accent={C.accent} sub="This session" />
        <StatCard label="Fraud Detected" value={fraudCount} icon={ShieldX} accent={C.high} sub="Flagged as fraudulent" />
        <StatCard label="High-Risk Alerts" value={highRisk} icon={ShieldAlert} accent={C.med} sub="Requiring review" />
        <StatCard label="Avg. Fraud Probability" value={`${(avgProb * 100).toFixed(1)}%`} icon={Gauge} accent={C.accent} sub="Across recent transactions" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <Card style={{ padding: 0 }}>
          <div style={{ padding: "16px 18px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <SectionLabel icon={Zap}>Real-Time Transaction Activity</SectionLabel>
            <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.textFaint }}>{transactions.length} shown</span>
          </div>
          {transactionsError ? (
            <div style={{ padding: "40px 18px", textAlign: "center" }}>
              <AlertTriangle size={20} color={C.high} style={{ marginBottom: 8 }} />
              <div style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: C.high, marginBottom: 4 }}>Fraud Engine Unavailable</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textFaint, marginBottom: 14 }}>{transactionsError}</div>
              <button
                onClick={refetchTransactions}
                style={{
                  fontFamily: FONT_BODY, fontSize: 12, color: C.text, background: C.panel2,
                  border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 14px", cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          ) : transactionsLoading ? (
            <div style={{ padding: "40px 18px", textAlign: "center", fontFamily: FONT_BODY, fontSize: 13, color: C.textFaint }}>
              Loading transactions…
            </div>
          ) : (
            <TransactionTable
              transactions={transactions}
              onRowClick={openTxn}
              limit={8}
              maxHeight={360}
              headerPadding="0 14px 8px"
            />
          )}
        </Card>

        <Card style={{ padding: 18 }}>
          <SectionLabel icon={BarChart3}>Risk Distribution</SectionLabel>
          <DistributionBar low={dist.low} med={dist.med} high={dist.high} />
          <div style={{ height: 1, background: C.borderSoft, margin: "18px 0" }} />
          <SectionLabel icon={GitBranch}>Detection Pipeline</SectionLabel>
          <MiniPipeline />
        </Card>
      </div>
    </div>
  );
}
