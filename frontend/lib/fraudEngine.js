import { RISK, ACTION } from "./constants";
import { rand } from "./utils";
import { NAMES, DEVICES, LOCATIONS } from "./mockData";

/*
 * ============================================================
 * DEV/DEMO-ONLY — NOT USED IN THE PRODUCTION DATA PATH
 * ============================================================
 * This module is a mock stand-in for the real ML/FastAPI fraud engine.
 * The app is now wired to the real backend (see services/api.js):
 * fraud probability, risk level, signals, SHAP values, and the AI
 * explanation all come from the live FastAPI service, never from here.
 *
 * Nothing in the production data path (services/api.js, hooks/,
 * context/, app/**\/page.jsx) imports this file. It's kept only as an
 * isolated utility for local UI work when the backend isn't running —
 * import it explicitly and manually in a scratch component if you need
 * to preview layouts offline; it must never be wired back into
 * fetchInitialTransactions/predictTransaction as a silent fallback.
 */

export const SIGNAL_LIBRARY = {
  newRecipient: { label: "Payment is being sent to a new recipient.", weight: 0.22, dir: "up" },
  deviceChange: { label: "Device was recently changed.", weight: 0.19, dir: "up" },
  remoteAccess: { label: "Remote-access activity was detected.", weight: 0.27, dir: "up" },
  ipRisk: { label: "Network/IP risk is elevated.", weight: 0.18, dir: "up" },
  velocity: { label: "Multiple transactions occurred within a short period.", weight: 0.16, dir: "up" },
  amountSpike: { label: "Transaction amount is unusually high for this account.", weight: 0.15, dir: "up" },
  muleSignal: { label: "Recipient account shows mule-like fund pass-through behavior.", weight: 0.24, dir: "up" },
  noFailedAttempts: { label: "No failed payment attempts detected.", weight: 0.10, dir: "down" },
  establishedHistory: { label: "Account has established history.", weight: 0.14, dir: "down" },
  normalAmount: { label: "Payment amount is close to normal behavior.", weight: 0.12, dir: "down" },
  knownDevice: { label: "Device matches prior verified logins.", weight: 0.11, dir: "down" },
};

const PRESET_PROFILES = {
  normal: { amount: [200, 900], up: [], down: ["noFailedAttempts", "establishedHistory", "normalAmount", "knownDevice"], prob: [0.01, 0.06] },
  newRecipient: { amount: [500, 2500], up: ["newRecipient"], down: ["noFailedAttempts", "knownDevice"], prob: [0.15, 0.32] },
  takeover: { amount: [3000, 15000], up: ["deviceChange", "remoteAccess", "ipRisk", "newRecipient"], down: [], prob: [0.85, 0.99] },
  remote: { amount: [1000, 8000], up: ["remoteAccess", "ipRisk"], down: ["establishedHistory"], prob: [0.55, 0.78] },
  rapid: { amount: [300, 1200], up: ["velocity", "newRecipient"], down: ["knownDevice"], prob: [0.4, 0.62] },
  mule: { amount: [5000, 20000], up: ["muleSignal", "velocity", "amountSpike"], down: [], prob: [0.9, 0.999] },
  suspicious: { amount: [1500, 6000], up: ["ipRisk", "amountSpike", "newRecipient"], down: ["knownDevice"], prob: [0.6, 0.82] },
  borderline: { amount: [800, 2000], up: ["newRecipient", "velocity"], down: ["establishedHistory", "noFailedAttempts"], prob: [0.35, 0.48] },
};

export function buildScenario(kind) {
  const sender = rand(NAMES);
  const recipient = rand(NAMES.filter((n) => n !== sender));
  const now = new Date();
  const base = {
    id: "TXN-" + Math.random().toString(36).slice(2, 9).toUpperCase(),
    sender, recipient, timestamp: now,
    device: rand(DEVICES), location: rand(LOCATIONS),
  };

  const p = PRESET_PROFILES[kind] || PRESET_PROFILES.normal;
  const amount = Math.round(p.amount[0] + Math.random() * (p.amount[1] - p.amount[0]));
  const prob = +(p.prob[0] + Math.random() * (p.prob[1] - p.prob[0])).toFixed(4);
  const riskLevel = prob >= 0.7 ? RISK.HIGH : prob >= 0.4 ? RISK.MEDIUM : RISK.LOW;
  const action = prob >= 0.7 ? ACTION.PAUSE : prob >= 0.4 ? ACTION.VERIFY : ACTION.GO;

  const upSignals = p.up.map((k) => ({ key: k, ...SIGNAL_LIBRARY[k] }));
  const downSignals = p.down.map((k) => ({ key: k, ...SIGNAL_LIBRARY[k] }));

  return {
    ...base, amount, fraudProbability: prob, riskLevel, action,
    signals: { up: upSignals, down: downSignals },
    shap: [...upSignals, ...downSignals].map((s) => ({
      feature: s.key, value: +(s.dir === "up" ? s.weight : -s.weight).toFixed(3),
    })),
    aiSummary: buildAiSummary(kind, riskLevel, upSignals, downSignals),
  };
}

/*
 * Generates a plausible feed of recent transactions for first paint by
 * repeatedly running buildScenario. Swappable for a real
 * GET /transactions call — see services/api.js.
 */
export function seedTransactions(n) {
  const kinds = ["normal", "normal", "normal", "newRecipient", "rapid", "borderline", "remote", "suspicious", "takeover", "mule"];
  const list = [];
  for (let i = 0; i < n; i++) {
    const t = buildScenario(rand(kinds));
    t.timestamp = new Date(Date.now() - i * 47000);
    list.push(t);
  }
  return list.sort((a, b) => b.timestamp - a.timestamp);
}

export function buildAiSummary(kind, riskLevel, up, down) {
  const reasons = up.map((s) => s.label.replace(/\.$/, "").replace(/^./, (c) => c.toLowerCase()));
  const summaryMap = {
    LOW: "This transaction closely matches the sender's established behavior and carries minimal risk indicators.",
    MEDIUM: "This transaction shows some deviation from typical behavior. A subset of risk signals were triggered, but not enough to conclusively flag it as fraudulent.",
    HIGH: "This transaction has been classified as high risk due to multiple suspicious behavioral signals.",
  };
  const key = riskLevel === RISK.HIGH ? "HIGH" : riskLevel === RISK.MEDIUM ? "MEDIUM" : "LOW";
  const actionNote = {
    HIGH: "Pausing the payment is appropriate because multiple high-risk indicators are present simultaneously.",
    MEDIUM: "Requesting additional verification is appropriate given the mixed risk profile of this transaction.",
    LOW: "Allowing the payment to proceed is appropriate; no material risk indicators were found.",
  }[key];
  return {
    summary: summaryMap[key],
    reasons: reasons.length ? reasons : ["no notable risk-increasing behavior"],
    action: actionNote,
    analystNote:
      key === "HIGH"
        ? "High-risk indicators dominate this transaction. Recommend manual review before release even if the payment is later resumed."
        : key === "MEDIUM"
        ? "Mixed signal profile. Recommend step-up verification rather than an outright block."
        : "Behavioral signals are consistent with the account's normal pattern.",
  };
}
