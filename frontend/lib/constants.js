import {
  Home, List, FlaskConical, LineChart as LineChartIcon, Brain, Info,
} from "lucide-react";

/* ============================================================
   DESIGN TOKENS
   Palette: deep signal-navy background, elevated panels, cyan
   "engine" accent, and a strict traffic-light risk vocabulary
   that never gets reused for anything else in the UI.
   ============================================================ */
export const C = {
  bg: "#080B10",
  bgGrid: "#0B0F16",
  panel: "#10151E",
  panel2: "#141B26",
  border: "#1D2733",
  borderSoft: "#161E29",
  text: "#E7EDF4",
  textDim: "#8A9AAD",
  textFaint: "#5A6A7D",
  accent: "#2DD4E0",
  accentDim: "#164852",
  low: "#34D399",
  lowDim: "#0F3B2E",
  med: "#F5A623",
  medDim: "#4A3510",
  high: "#F0475C",
  highDim: "#4A1420",
};

/*
 * Fonts are loaded via next/font/google in app/layout.jsx, which exposes
 * them as CSS custom properties on the <html> element. Referencing those
 * variables here means every component that already imports FONT_HEAD /
 * FONT_BODY / FONT_MONO keeps working unchanged.
 */
export const FONT_HEAD = "var(--font-head), system-ui, sans-serif";
export const FONT_BODY = "var(--font-body), system-ui, sans-serif";
export const FONT_MONO = "var(--font-mono), ui-monospace, monospace";

/* ============================================================
   DOMAIN CONSTANTS
   ============================================================ */
export const RISK = { LOW: "LOW RISK", MEDIUM: "MEDIUM RISK", HIGH: "HIGH RISK" };
export const ACTION = { GO: "PROCEED", VERIFY: "VERIFY PAYMENT", PAUSE: "PAUSE PAYMENT" };

/* ============================================================
   NAVIGATION
   Routes map 1:1 to the app/ directory structure.
   ============================================================ */
export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/transactions", label: "Transactions", icon: List },
  { href: "/simulator", label: "Simulator", icon: FlaskConical },
  { href: "/analytics", label: "Analytics", icon: LineChartIcon },
  { href: "/model", label: "Model Insights", icon: Brain },
  { href: "/about", label: "About", icon: Info },
];

/* ============================================================
   SIMULATOR CONFIG
   ============================================================ */
export const PRESETS = [
  { key: "normal", label: "Normal Transaction", desc: "Typical low-risk payment" },
  { key: "newRecipient", label: "New Recipient", desc: "First payment to this recipient" },
  { key: "takeover", label: "Account Takeover", desc: "Device + location + access changed" },
  { key: "remote", label: "Remote Access", desc: "Remote-access tooling detected" },
  { key: "rapid", label: "Rapid Transfers", desc: "High transaction velocity" },
  { key: "mule", label: "Mule Account", desc: "Recipient shows pass-through behavior" },
  { key: "suspicious", label: "Suspicious Transaction", desc: "Elevated IP + amount anomaly" },
  { key: "borderline", label: "Borderline Transaction", desc: "Mixed weak signals" },
];

export const PIPELINE_STAGES = [
  { key: "event", label: "Transaction Event" },
  { key: "features", label: "Feature Engineering" },
  { key: "xgb", label: "Calibrated XGBoost" },
  { key: "shap", label: "SHAP Attribution" },
  { key: "gemini", label: "Gemini Explanation" },
  { key: "result", label: "Result" },
];
