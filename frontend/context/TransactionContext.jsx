"use client";

import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { fetchInitialTransactions, checkBackendHealth } from "@/services/api";

/**
 * Shared transaction feed, drawer state, and real backend system status.
 * Wraps the whole app (see app/layout.jsx).
 *
 * systemOnline reflects actual GET /health responses (polled), not a
 * hardcoded value. transactionsError is set when GET /transactions
 * fails, so pages can render an explicit "Fraud Engine Unavailable"
 * state instead of an empty or fabricated feed.
 */
export const TransactionContext = createContext(null);

const HEALTH_POLL_MS = 10000;
const FEED_SIZE = 14;
const MAX_TRANSACTIONS_HELD = 60;

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState(null);
  const [activeTxn, setActiveTxn] = useState(null);
  const [systemOnline, setSystemOnline] = useState(false);

  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const loadTransactions = useCallback(() => {
    setTransactionsLoading(true);
    setTransactionsError(null);

    fetchInitialTransactions(FEED_SIZE)
      .then((data) => {
        if (mountedRef.current) setTransactions(data);
      })
      .catch((err) => {
        if (mountedRef.current) {
          setTransactionsError(err.message || "Unable to load transactions.");
        }
      })
      .finally(() => {
        if (mountedRef.current) setTransactionsLoading(false);
      });
  }, []);

  useEffect(() => {
    loadTransactions();

    const pollHealth = () => {
      checkBackendHealth().then((online) => {
        if (mountedRef.current) setSystemOnline(online);
      });
    };
    pollHealth();
    const interval = setInterval(pollHealth, HEALTH_POLL_MS);

    return () => clearInterval(interval);
  }, [loadTransactions]);

  const addTransaction = useCallback((txn) => {
    setTransactions((prev) => [txn, ...prev].slice(0, MAX_TRANSACTIONS_HELD));
  }, []);

  const openTxn = useCallback((txn) => setActiveTxn(txn), []);
  const closeTxn = useCallback(() => setActiveTxn(null), []);

  const value = {
    transactions,
    transactionsLoading,
    transactionsError,
    refetchTransactions: loadTransactions,
    addTransaction,
    activeTxn,
    openTxn,
    closeTxn,
    systemOnline,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
