# Fraud Explainer — Next.js

A real-time transaction fraud detection & explanation UI, refactored from a single
1,000+ line React component into a proper Next.js (App Router) application.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — it redirects to `/dashboard`.

## Architecture

```
app/            Routes (App Router). Each page.jsx composes components below
                and reads shared state via hooks/useTransactions.
components/     UI split by domain: common (Card, pills, bars), layout
                (Sidebar, AppShell), transactions, dashboard, simulator,
                analytics, model, about.
context/        TransactionContext — the single source of truth for the
                transaction feed, the open detail drawer, and system status.
                Provided once in app/layout.jsx so it survives navigation.
hooks/          useTransactions (context accessor), useSimulator (encapsulates
                the simulator's form state + staged pipeline animation).
lib/            constants.js (design tokens, fonts, RISK/ACTION, nav config),
                mockData.js (name/device/location pools), fraudEngine.js
                (buildScenario / buildAiSummary / seedTransactions — an
                isolated dev/demo utility, NOT used in the production data
                path — see services/api.js), utils.js (rand, fmtTime).
services/       api.js — every network-shaped call goes through here. This is
                the real backend client; there is no mock fallback.
```

## Backend

This app is wired to the real FastAPI ML backend (calibrated XGBoost +
SHAP + Gemini) — not a mock. Set `API_BASE_URL` in `.env.local`
to your FastAPI server (defaults to `http://localhost:8000`; see
`.env.local`). Start the backend first, then `npm run dev`.

Real contract, as implemented in `services/api.js`:

- `checkBackendHealth()` → `GET /health` — polled every 10s, drives the
  System Status indicator.
- `fetchInitialTransactions(n)` → `GET /transactions?limit={n}` — powers the
  Dashboard/Transactions feed on load.
- `predictTransaction(body, context)` → `POST /transactions` — submits a real
  transaction (built by `hooks/useSimulator.js` from the Simulator form) and
  returns the scored, explained result.

`POST /predict` also exists on the backend but takes 28 pre-engineered ML
features directly, not raw transaction info — it isn't used by this UI.

The backend was extended in three small, additive ways to support this
frontend (no ML logic touched):
1. **CORS** — required for the browser to reach a different-origin FastAPI
   server at all.
2. **`shap` in the response** — the backend already computed SHAP
   contributions internally (for the Gemini prompt) but never returned them;
   now both `/predict` and `/transactions` include a `shap` array.
3. **`GET /transactions` + result persistence** — the in-memory transaction
   store only ever kept the raw request, not the scored result. It now also
   records each result and exposes a listing endpoint, so the
   Dashboard/Transactions feed reflects real history instead of having
   nothing to load.

No component, hook, or page needs further changes for this to work end to
end, provided the backend above is running.

## Notes on the conversion

- **Fonts**: switched from a runtime-injected Google Fonts `<link>` to
  `next/font/google` in `app/layout.jsx`, exposed as CSS variables consumed by
  `FONT_HEAD` / `FONT_BODY` / `FONT_MONO` in `lib/constants.js` — no component
  code needed to change.
- **Navigation**: the old `useState("dashboard")` page-switcher is now real
  routes (`/dashboard`, `/transactions`, ...), with `Sidebar` using
  `next/link` + `usePathname` for active-state highlighting.
- **Global state**: transactions, the open detail drawer, and system status
  moved from `FraudExplainerApp`'s local `useState` into `TransactionContext`
  so they persist across route navigation instead of resetting per page.
- **Hydration safety**: real network calls (`fetch`) and Recharts'
  `ResponsiveContainer` (which measures the DOM after mount) are only safe to
  run in the browser. The transaction feed is fetched in a `useEffect` inside
  `TransactionContext`, and the analytics page's derived datasets are built
  in a `useEffect` too, so the first client render always matches the
  server-rendered HTML.
- **No mock fallback**: `services/api.js` never substitutes generated data
  when the backend is unavailable, slow, or returns something unexpected —
  it throws, and the Dashboard/Transactions/Simulator pages render an
  explicit "Fraud Engine Unavailable" state instead. `lib/fraudEngine.js`
  still exists for offline UI work but is not imported by any page, hook, or
  service.
- **Analytics is honest about what it doesn't know**: the old ROC-AUC /
  precision / recall / false-positive / false-negative figures were
  hardcoded placeholders with no real source (there's no labeled evaluation
  set anywhere in this app). They've been removed rather than replaced with
  different placeholders. "Top Fraud Indicators" is now a real aggregate of
  each scored transaction's SHAP contributions instead of a fixed list.
