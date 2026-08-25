"use client";

import Sidebar from "./Sidebar";
import TransactionDrawer from "@/components/transactions/TransactionDrawer";
import { useTransactions } from "@/hooks/useTransactions";
import { C, FONT_BODY } from "@/lib/constants";

/*
 * Equivalent to the root <div> in the original FraudExplainerApp: a
 * persistent sidebar plus a scrollable content area, with the
 * transaction detail drawer overlaid on top so it's reachable from any
 * route. Rendered once in app/layout.jsx around {children}, so
 * navigating between pages no longer remounts the sidebar or loses
 * drawer state.
 */
export default function AppShell({ children }) {
  const { activeTxn, closeTxn } = useTransactions();

  return (
    <div
      style={{
        display: "flex", minHeight: "100vh", background: C.bg,
        fontFamily: FONT_BODY, color: C.text,
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, overflowY: "auto", padding: "22px 26px" }}>{children}</div>
      <TransactionDrawer txn={activeTxn} onClose={closeTxn} showShap={true} />
    </div>
  );
}
