import { C, FONT_MONO } from "@/lib/constants";
import TransactionRow from "./TransactionRow";

/*
 * Shared table body (column header + rows). Callers wrap this in their
 * own <Card> so each page can add its own header content (e.g. the
 * "shown" count on the dashboard, or filter buttons on the Transactions
 * page) without this component needing to know about it.
 */
export default function TransactionTable({
  transactions,
  onRowClick,
  limit,
  maxHeight,
  headerPadding = "12px 14px",
  emptyMessage = "No transactions match this filter.",
}) {
  const rows = limit ? transactions.slice(0, limit) : transactions;

  return (
    <>
      <div
        style={{
          display: "grid", gridTemplateColumns: "1.6fr 0.9fr 0.9fr 1fr 1fr 1fr auto",
          padding: headerPadding, fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint,
          letterSpacing: 0.5, borderBottom: `1px solid ${C.borderSoft}`,
        }}
      >
        <span>PARTIES</span>
        <span>AMOUNT</span>
        <span>TIME</span>
        <span>RISK</span>
        <span>PROBABILITY</span>
        <span>ACTION</span>
        <span></span>
      </div>
      <div style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}>
        {rows.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: C.textFaint, fontSize: 13 }}>{emptyMessage}</div>
        ) : (
          rows.map((t) => <TransactionRow key={t.id} t={t} onClick={() => onRowClick(t)} />)
        )}
      </div>
    </>
  );
}
