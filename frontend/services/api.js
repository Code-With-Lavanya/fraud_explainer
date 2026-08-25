/*
 * ============================================================
 * API SERVICE LAYER
 * ============================================================
 * Every network call the frontend makes goes through this file.
 * This is a real, backend-dependent client: there is no mock
 * fallback in this file, and no fraud probability, risk level,
 * signal, SHAP value, or AI explanation is ever computed here.
 * Everything the UI shows comes from the FastAPI response.
 *
 * `lib/fraudEngine.js` (buildScenario/seedTransactions/buildAiSummary)
 * still exists in the repo as an isolated dev/demo utility, but it is
 * NOT imported anywhere in this file or in the production data path.
 *
 * Base URL:
 *   NEXT_PUBLIC_API_BASE_URL (e.g. .env.local: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000)
 *   Falls back to http://localhost:8000 for local dev.
 *
 * Backend contract (confirmed against the actual FastAPI source,
 * not assumed):
 *   GET  /health                 -> { status, model, transactions_seen }
 *   GET  /transactions?limit=N   -> Array<StoredTransaction>
 *   POST /transactions           -> ScoredTransaction   (the real "submit + predict" endpoint)
 *   POST /predict                -> ScoredTransaction   (takes pre-engineered ML features directly;
 *                                                          not used by the simulator UI)
 * ============================================================
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Shared fetch wrapper. Centralizes every error case the instructions
 * called out: backend unavailable, timeout, HTTP 4xx/5xx, malformed
 * response, empty response. Never returns fake data on failure —
 * always throws, so callers can render an explicit error state.
 */
async function apiFetch(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, signal: controller.signal });
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      throw new Error("Request to the fraud engine timed out.");
    }
    throw new Error("Unable to connect to the prediction service.");
  }
  clearTimeout(timer);

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("The fraud engine returned a malformed response.");
    }
  }

  if (!res.ok) {
    const detail = (data && data.detail) || `Request failed (${res.status})`;
    throw new Error(detail);
  }

  if (data === null) {
    throw new Error("The fraud engine returned an empty response.");
  }

  return data;
}

/* ============================================================
 * ADAPTER
 * ============================================================
 * Maps the backend's actual JSON shape onto the frontend's existing
 * Transaction shape (unchanged, so no component needs to change):
 *   { id, sender, recipient, timestamp, device, location, amount,
 *     fraudProbability, riskLevel, action,
 *     signals: { up: [{key,label}], down: [{key,label}] },
 *     shap: [{feature, label, value}],
 *     aiSummary: { summary, reasons, action, analystNote } }
 *
 * `context` supplies fields the backend doesn't echo back on
 * POST /transactions (device/location/timestamp) — these are the
 * exact values the frontend itself sent in the request, not
 * invented ones. GET /transactions items carry these fields
 * natively from the backend and take precedence when present.
 */

function adaptSignalList(list) {
  if (!Array.isArray(list)) return [];
  return list.map((label, i) => ({
    key: `${label || "signal"}-${i}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48),
    label,
  }));
}

function adaptShap(list) {
  if (!Array.isArray(list)) return [];
  return list.map((s) => ({
    feature: s.feature,
    label: s.label || s.feature,
    value: Number.isFinite(s.shap_value) ? +s.shap_value.toFixed(3) : Number(s.value) || 0,
  }));
}

function adaptExplanation(explanation) {
  if (!explanation) return { summary: "", reasons: [], action: "", analystNote: "" };
  return {
    summary: explanation.summary || "",
    reasons: explanation.why_flagged || [],
    action: explanation.recommended_action_reason || "",
    analystNote: explanation.analyst_note || "",
  };
}

function adaptTransaction(raw, context = {}) {
  const timestamp = raw.timestamp
    ? new Date(raw.timestamp)
    : context.timestamp instanceof Date
      ? context.timestamp
      : new Date();

  return {
    id: raw.transaction_id,
    sender: raw.sender ?? context.sender,
    recipient: raw.recipient ?? context.recipient,
    timestamp,
    device: raw.device_id ?? context.device,
    location: raw.location ?? context.location,
    amount: Number(raw.amount ?? context.amount ?? 0),
    fraudProbability: raw.fraud_probability,
    riskLevel: raw.risk_level,
    action: raw.recommended_action,
    signals: {
      up: adaptSignalList(raw.risk_increasing_signals),
      down: adaptSignalList(raw.risk_reducing_signals),
    },
    shap: adaptShap(raw.shap),
    aiSummary: adaptExplanation(raw.explanation),
  };
}

/* ============================================================
 * PUBLIC API
 * ============================================================ */

/**
 * Backend heartbeat. Real endpoint: GET /health
 * Returns a plain boolean — never throws, so callers can poll it
 * on an interval without wrapping every call in try/catch.
 */
export async function checkBackendHealth() {
  try {
    const data = await apiFetch("/health", { cache: "no-store" });
    return data.status === "healthy";
  } catch {
    return false;
  }
}

/**
 * Fetches the initial transaction feed shown on load.
 * Real endpoint: GET /transactions?limit={n}
 * Throws on failure — callers must show an explicit error state,
 * not fall back to generated data.
 */
export async function fetchInitialTransactions(n = 14) {
  const data = await apiFetch(`/transactions?limit=${n}`, { cache: "no-store" });
  if (!Array.isArray(data)) {
    throw new Error("The fraud engine returned a malformed transaction list.");
  }
  return data.map((item) => adaptTransaction(item));
}

/**
 * Submits a real transaction and returns the scored, explained result.
 * Real endpoint: POST /transactions
 * `requestBody` must already match the backend's TransactionRequest
 * schema (built by useSimulator.js). `context` carries the
 * device/location/timestamp we sent, used only to fill fields the
 * backend doesn't echo back — never to influence the score itself.
 */
export async function predictTransaction(requestBody, context = {}) {
  const data = await apiFetch("/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  return adaptTransaction(data, context);
}
