"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PIPELINE_STAGES } from "@/lib/constants";
import { DEVICES, LOCATIONS } from "@/lib/mockData";
import { predictTransaction } from "@/services/api";
import { useTransactions } from "./useTransactions";

const STAGE_INTERVAL_MS = 420;

/*
 * ============================================================
 * SCENARIO PROFILES
 * ============================================================
 * There is no "kind"/scenario parameter on the real backend — the
 * fraud probability is entirely a function of the raw transaction
 * fields it receives (device/location history, IP risk, remote
 * access, mule linkage, account age, failed attempts, velocity).
 *
 * Each preset below maps to real values for the fields the visible
 * form doesn't collect, so the actual XGBoost model — not the
 * frontend — decides the resulting probability. Sender, recipient,
 * amount, device, and location always come from the visible form,
 * exactly as before; presets never override them.
 */
const SCENARIO_PROFILES = {
  normal:       { accountAgeDays: 900, failedAttempts: 0, remoteAccessFlag: 0, muleAccountLink: 0, ipTier: "safe" },
  newRecipient: { accountAgeDays: 900, failedAttempts: 0, remoteAccessFlag: 0, muleAccountLink: 0, ipTier: "safe", forceNewRecipient: true },
  takeover:     { accountAgeDays: 45,  failedAttempts: 3, remoteAccessFlag: 1, muleAccountLink: 0, ipTier: "high", forceNewRecipient: true },
  remote:       { accountAgeDays: 500, failedAttempts: 1, remoteAccessFlag: 1, muleAccountLink: 0, ipTier: "medium" },
  rapid:        { accountAgeDays: 500, failedAttempts: 0, remoteAccessFlag: 0, muleAccountLink: 0, ipTier: "safe", forceNewRecipient: true, burst: 4 },
  mule:         { accountAgeDays: 200, failedAttempts: 0, remoteAccessFlag: 0, muleAccountLink: 1, ipTier: "medium", forceNewRecipient: true },
  suspicious:   { accountAgeDays: 300, failedAttempts: 0, remoteAccessFlag: 0, muleAccountLink: 0, ipTier: "high", forceNewRecipient: true },
  borderline:   { accountAgeDays: 200, failedAttempts: 0, remoteAccessFlag: 0, muleAccountLink: 0, ipTier: "safe", forceNewRecipient: true },
};

const IP_PREFIX = { safe: "SAFE", medium: "MED", high: "RISK" };

function slug(str) {
  return (str || "UNKNOWN").trim().toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 24);
}

function randomToken() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function newTransactionId() {
  return `TXN-${Date.now().toString(36).toUpperCase()}${randomToken().slice(0, 4)}`;
}

/**
 * A stable synthetic user id for this browser tab/session — the
 * backend has no auth, but user_id is required and drives real
 * recipient/velocity history. This is plumbing, not a fraud signal:
 * it never affects the score directly, only which transactions the
 * backend treats as "the same person's" history.
 */
function getSimulatorUserId() {
  if (typeof window === "undefined") return "U-SIM-TEMP";
  const KEY = "fraud-explainer-sim-user-id";
  let id = window.sessionStorage.getItem(KEY);
  if (!id) {
    id = `U-SIM-${randomToken()}`;
    window.sessionStorage.setItem(KEY, id);
  }
  return id;
}

/**
 * The device dropdown labels already encode "known" vs "new/unregistered"
 * (see lib/mockData.js). A "(known)" label maps to a stable id — reusing
 * it again this session looks like the same known device, so
 * device_change is 0 after the first use. Anything else generates a
 * fresh id every call, so it always looks new — exactly as the label
 * implies.
 */
function resolveDeviceId(deviceLabel) {
  if (deviceLabel && deviceLabel.includes("(known)")) {
    return `DEV-${slug(deviceLabel)}`;
  }
  return `NEW-DEV-${randomToken()}`;
}

function resolveRecipientId(recipientName, forceNew) {
  return forceNew ? `REC-${randomToken()}` : `REC-${slug(recipientName)}`;
}

function resolveIpAddress(tier) {
  return `${IP_PREFIX[tier] || "SAFE"}-${randomToken()}`;
}

/**
 * Builds the real TransactionRequest body the backend expects, from
 * the visible form plus a scenario profile's hidden-field values.
 */
function buildRequestBody(form, profile) {
  const amount = Number(form.amount) || 0;
  return {
    transaction_id: newTransactionId(),
    user_id: getSimulatorUserId(),
    sender_name: form.sender,
    recipient_id: resolveRecipientId(form.recipient, !!profile.forceNewRecipient),
    recipient_name: form.recipient,
    amount,
    device_id: resolveDeviceId(form.device),
    ip_address: resolveIpAddress(profile.ipTier),
    location: form.location,
    timestamp: new Date().toISOString(),
    account_age_days: profile.accountAgeDays,
    failed_attempts: profile.failedAttempts,
    remote_access_flag: profile.remoteAccessFlag,
    mule_account_link: profile.muleAccountLink,
  };
}

/**
 * Runs one scenario against the real backend. For velocity-dependent
 * presets (e.g. "Rapid Transfers"), fires a few quick real preliminary
 * transactions first so the backend's actual velocity_10min feature
 * reflects genuine recent history — not a frontend-invented flag.
 * Only the final, displayed transaction is added to the visible feed.
 */
async function runScenario(kind, form) {
  const profile = SCENARIO_PROFILES[kind] || SCENARIO_PROFILES.normal;
  const amount = Number(form.amount) || 0;

  const burst = profile.burst || 0;
  for (let b = 0; b < burst; b++) {
    const burstBody = buildRequestBody(form, profile);
    burstBody.amount = Math.max(50, Math.round(amount * (0.3 + Math.random() * 0.4)));
    try {
      await predictTransaction(burstBody, {});
    } catch {
      // Best-effort — a failed warm-up call shouldn't block the real one;
      // if the backend is genuinely down the real call below will throw.
    }
  }

  const timestamp = new Date();
  const body = buildRequestBody(form, profile);
  body.amount = amount;
  body.timestamp = timestamp.toISOString();

  return predictTransaction(body, {
    sender: form.sender,
    recipient: form.recipient,
    device: form.device,
    location: form.location,
    amount,
    timestamp,
  });
}

/**
 * Drives the Live Transaction Simulator: form state for the event being
 * simulated, the staged pipeline animation, and the final result — or
 * an error if the backend/prediction call fails. On failure the
 * pipeline stops where it is; no fake result is ever substituted.
 */
export function useSimulator() {
  const { addTransaction } = useTransactions();
  const [form, setForm] = useState({
    sender: "Mohit",
    recipient: "Rahul",
    amount: 1060,
    device: DEVICES[0],
    location: LOCATIONS[0],
  });
  const [running, setRunning] = useState(false);
  const [stageIdx, setStageIdx] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const updateField = useCallback((key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  const runSimulation = useCallback(
    (kind) => {
      setRunning(true);
      setResult(null);
      setError(null);
      setStageIdx(0);
      let i = 0;
      clearInterval(timerRef.current);
      timerRef.current = setInterval(async () => {
        i++;
        if (i >= PIPELINE_STAGES.length) {
          clearInterval(timerRef.current);
          try {
            const r = await runScenario(kind, form);
            setResult(r);
            addTransaction(r);
          } catch (err) {
            setError(err.message || "Unable to connect to the prediction service.");
          } finally {
            setRunning(false);
          }
        } else {
          setStageIdx(i);
        }
      }, STAGE_INTERVAL_MS);
    },
    [form, addTransaction]
  );

  useEffect(() => () => clearInterval(timerRef.current), []);

  return { form, updateField, running, stageIdx, result, error, runSimulation };
}
