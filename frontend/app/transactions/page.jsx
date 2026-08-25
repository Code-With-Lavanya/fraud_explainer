"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { C, FONT_HEAD, FONT_BODY, FONT_MONO } from "@/lib/constants";
import { useTransactions } from "@/hooks/useTransactions";
import Card from "@/components/common/Card";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionTable from "@/components/transactions/TransactionTable";

export default function TransactionsPage() {
  const { transactions, transactionsLoading, transactionsError, openTxn, refetchTransactions } = useTransactions();
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? transactions : transactions.filter((t) => t.riskLevel === filter);

  return (
    <div>
      <h1 style={{ fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Transactions</h1>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.textDim, margin: "0 0 16px" }}>All transaction events evaluated by the fraud engine.</p>

      <TransactionFilters value={filter} onChange={setFilter} />

      <Card style={{ padding: 0 }}>
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
          <TransactionTable transactions={filtered} onRowClick={openTxn} />
        )}
      </Card>
    </div>
  );
}
