"use client";

import { useContext } from "react";
import { TransactionContext } from "@/context/TransactionContext";

/**
 * Access the shared transaction feed, drawer state, and system status.
 * Must be called from a descendant of <TransactionProvider> (see
 * app/layout.jsx, which wraps the whole app).
 */
export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return ctx;
}
