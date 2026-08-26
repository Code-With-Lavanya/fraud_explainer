# Fraud Explainer

> **Build & Bank Hackathon Project**
>
> An explainable, real-time fraud detection prototype combining a
> calibrated XGBoost fraud model, SHAP-based explainability, and
> Gemini-powered analyst explanations.

------------------------------------------------------------------------

## Overview

**Fraud Explainer** is a hackathon project built for **Build & Bank**.
It demonstrates how AI/ML can detect suspicious financial transactions
while also explaining *why* a transaction was considered risky.

Instead of returning only `Fraud / Not Fraud`, the system presents:

-   Fraud probability
-   Risk classification
-   Recommended action
-   Risk-increasing and risk-reducing signals
-   SHAP feature contributions
-   AI-generated explanation
-   Transaction history
-   Interactive transaction simulation

This is a **working prototype**, not a production banking system. Known
limitations are documented below.

------------------------------------------------------------------------

## Core Workflow

``` text
Transaction
    ↓
Feature Engineering
    ↓
XGBoost Fraud Model
    ↓
Fraud Probability
    ↓
SHAP Explainability
    ↓
Gemini Analyst Explanation
    ↓
Risk + Action + Human-readable Explanation
```

------------------------------------------------------------------------

## Architecture

``` text
┌──────────────────────────────┐
│       Next.js Frontend       │
│           Vercel             │
└──────────────┬───────────────┘
               │ HTTPS / REST
               ▼
┌──────────────────────────────┐
│       FastAPI Backend        │
│           Render             │
└──────────────┬───────────────┘
               │
       ┌───────┼────────┐
       ▼       ▼        ▼
   XGBoost    SHAP    Gemini
   Scoring  Explain.   AI
       │       │        │
       └───────┼────────┘
               ▼
     Risk + Explanation
```

## Technology Stack

  Layer                 Technology
  --------------------- -----------------
  Frontend              Next.js / React
  Styling               Tailwind CSS
  Backend               FastAPI
  Machine Learning      XGBoost
  Explainability        SHAP
  Generative AI         Google Gemini
  Data Processing       Pandas / NumPy
  API                   REST
  Frontend Deployment   Vercel
  Backend Deployment    Render
  Python Runtime        Python 3.12.10

------------------------------------------------------------------------

# Features

## 1. Transaction Simulator

The simulator provides:

-   Sender
-   Recipient
-   Transaction amount
-   Device
-   Location
-   Fraud scenario

The selected scenario changes additional behavioural/contextual values
sent to the real backend model.

## 2. ML Fraud Detection

The backend generates a fraud probability using the trained XGBoost
model and converts it into a risk classification and recommended action.

Example:

``` text
Risk: LOW RISK
Probability: 0.03%
Action: PROCEED
```

## 3. SHAP Explainability

SHAP identifies which features contributed to the prediction.

Example:

``` text
New recipient
SHAP: +1.60
→ increases risk

Amount deviation
SHAP: -1.92
→ reduces risk
```

The exact values are generated from the actual transaction.

## 4. Gemini Explanation

Gemini acts as an explanation layer. It converts the model's actual
prediction and SHAP evidence into a human-readable analyst-style
explanation.

The LLM does **not** independently decide whether a transaction is
fraudulent.

``` text
XGBoost → Prediction
SHAP    → Evidence
Gemini  → Explanation
```

## 5. Transaction History

The backend maintains transaction information used by the simulator and
history-dependent signals such as recipient history, velocity, and
unique recipients.

------------------------------------------------------------------------

# ⚠️ Important: Use the Fraud Simulator Correctly

The simulator contains scenario options such as:

-   **Normal**
-   **New Recipient**
-   **Account Takeover**
-   **Remote Access**
-   **Rapid Transfers**
-   **Mule Account**
-   **Suspicious Transaction**
-   **Borderline**

### Select the scenario that actually matches the situation.

These are **not merely visual labels**. Each scenario maps to additional
input fields that are sent to the actual backend model.

  Situation                          Scenario
  ---------------------------------- ------------------------
  Ordinary trusted payment           Normal
  First transaction to a recipient   New Recipient
  Possible compromised account       Account Takeover
  Remote access detected             Remote Access
  Multiple rapid transfers           Rapid Transfers
  Possible mule-account behaviour    Mule Account
  High-risk activity/network         Suspicious Transaction
  Near decision boundary             Borderline

### Why this matters

The backend currently does not receive a separate `scenario` parameter.
The selected scenario changes the actual model inputs.

Therefore, if you simply use the generic **"Simulate Fraudulent
Transaction"** option without selecting the appropriate situation above
it, the model can receive an extreme feature combination.

In the current prototype this can cause the UI to display **100% fraud
probability** or another extreme result.

> **For the current demo, select the scenario that actually represents
> the situation you want to demonstrate before running the
> transaction.**

This is a known prototype limitation and is planned for improvement.

------------------------------------------------------------------------

# Known Limitations

## 1. "Fraud Engine Unavailable"

The frontend may currently display:

``` text
FRAUD ENGINE UNAVAILABLE
```

even when the deployed FastAPI backend and ML model are reachable.

This is a known **frontend/backend health-state integration issue** and
does not necessarily mean the fraud model is down.

### Planned fix

Future versions will improve:

-   Backend health detection
-   Frontend health synchronisation
-   Cold-start handling
-   Loading states
-   API timeout handling
-   Error-state separation
-   Health polling

The goal is to distinguish between:

``` text
Backend Online
Backend Starting
Backend Temporarily Unavailable
Model Unavailable
Request Failed
```

## 2. Extreme / 100% Fraud Probability

Some simulator combinations currently produce extremely high
probabilities, including `100%`.

This is related to the current prototype's scenario configuration and
probability calibration.

### Planned fix

Future versions will improve:

-   Scenario calibration
-   Probability calibration
-   Decision thresholds
-   Synthetic transaction distributions
-   Feature ranges
-   Borderline examples
-   Model validation
-   Realistic transaction patterns

------------------------------------------------------------------------

# Backend

The backend uses **FastAPI**.

Responsibilities:

-   Validate transaction requests
-   Build model features
-   Track transaction history
-   Run XGBoost
-   Calculate SHAP contributions
-   Generate AI explanations
-   Return structured fraud-risk results

## API

Backend:

``` text
https://fraud-explainer.onrender.com
```

Endpoints:

``` text
GET  /health
GET  /transactions
POST /transactions
POST /predict
GET  /docs
```

Swagger:

``` text
https://fraud-explainer.onrender.com/docs
```

------------------------------------------------------------------------

# Frontend ↔ Backend Deployment

The frontend is deployed on **Vercel** and the backend on **Render**.

Frontend environment variable:

``` env
NEXT_PUBLIC_API_BASE_URL=https://fraud-explainer.onrender.com
```

The `NEXT_PUBLIC_` prefix is required because the browser-side frontend
needs the public backend URL. It must never be used for secrets or API
keys.

Backend:

``` text
https://fraud-explainer.onrender.com
```

------------------------------------------------------------------------

# Local Development

## Backend

``` bash
git clone https://github.com/Code-With-Lavanya/fraud_explainer.git
cd fraud_explainer/backend
```

Use Python **3.12.10**.

``` bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend:

``` text
http://localhost:8000
```

Swagger:

``` text
http://localhost:8000/docs
```

## Frontend

``` bash
cd frontend
npm install
```

Create `.env.local`:

``` env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Run:

``` bash
npm run dev
```

Frontend:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# Project Structure

``` text
fraud_explainer/
│
├── backend/
│   ├── main.py
│   ├── schemas.py
│   ├── services/
│   │   ├── explainer.py
│   │   └── ...
│   ├── model/
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   │   └── api.js
│   └── ...
│
├── .python-version
├── .gitignore
├── requirements.txt
└── README.md
```

------------------------------------------------------------------------

# Why XGBoost + SHAP + Gemini?

Each technology has a separate responsibility:

### XGBoost --- Prediction

Determines the fraud probability from transaction features.

### SHAP --- Explainability

Identifies which features pushed the prediction toward or away from
fraud.

### Gemini --- Communication

Converts technical model evidence into an understandable explanation.

This separation is intentional:

``` text
XGBoost → Actual prediction
SHAP    → Actual contributing evidence
Gemini  → Human-readable explanation
```

------------------------------------------------------------------------

# Fraud Detection Signals

The system can use signals including:

-   Transaction amount
-   Amount deviation
-   Account age
-   Failed payment attempts
-   Remote-access activity
-   Mule-account linkage
-   IP/network risk
-   Recipient history
-   Transaction velocity
-   Unique recipients
-   Device-related behaviour
-   Location-related information
-   Time-related behaviour

The exact feature vector is determined by the trained model and backend
feature-engineering pipeline.

------------------------------------------------------------------------

# Explainability Philosophy

The project aims to move from:

``` text
Prediction
```

to:

``` text
Prediction
    +
Evidence
    +
Explanation
```

For example:

``` text
Fraud Probability
       ↓
Why?
       ↓
New recipient
High network risk
Unusual velocity
Remote access
       ↓
What should an analyst do?
       ↓
Recommended Action
```

------------------------------------------------------------------------

# Build & Bank

Fraud Explainer was created for the **Build & Bank Hackathon**.

The project focuses on a banking-oriented problem:

> **How can an ML-based fraud detection system make its decisions more
> transparent and understandable?**

It combines:

``` text
Banking Problem
      ↓
Fraud Detection
      ↓
Machine Learning
      ↓
Explainable AI
      ↓
Generative AI
      ↓
Interactive Product
```

------------------------------------------------------------------------

# Team

## Lavanya Singh

**B.Com. (Hons.) \| University of Delhi (DU)**

**Role:** Project Lead / Primary Developer

Responsible for overall project development, frontend/backend
integration, deployment, model integration, explainability workflow, and
project coordination.

GitHub:

https://github.com/Code-With-Lavanya

## Aman Anand

**B.Tech \| Vivekananda Institute of Professional Studies (VIPS)**

**Role:** Team Member / Contributor\*\*

## Sasang Sitlhou

**B.Tech \| Delhi Technological University (DTU)**

**Role:** Team Member / Contributor\*\*

> The repository is maintained under **Code-With-Lavanya** as the
> primary project repository. Exact individual contribution descriptions
> can be expanded according to the team's final hackathon submission.

------------------------------------------------------------------------

# Current Project Status

  Component                            Status
  ------------------------------------ -------------------------
  Next.js Frontend                     ✅ Deployed
  FastAPI Backend                      ✅ Deployed
  XGBoost Fraud Model                  ✅ Integrated
  SHAP Explainability                  ✅ Working
  Gemini Explanation Layer             ✅ Integrated
  Transaction API                      ✅ Working
  Swagger API Docs                     ✅ Available
  Vercel Deployment                    ✅ Live
  Render Deployment                    ✅ Live
  Fraud Engine Availability UI         ⚠️ Known Issue
  Probability / Scenario Calibration   ⚠️ Known Limitation
  Production Banking Readiness         ❌ Not production-ready

------------------------------------------------------------------------

# Future Roadmap

## Phase 1 --- Stabilise the Prototype

-   Fix the incorrect **Fraud Engine Unavailable** state
-   Improve frontend/backend health synchronisation
-   Fix generic fraud simulation behaviour
-   Improve probability calibration
-   Improve scenario calibration
-   Add stronger API error handling
-   Add integration tests
-   Improve cold-start handling

## Phase 2 --- Improve the ML Model

-   Expand the training dataset
-   Use more realistic transaction distributions
-   Improve class imbalance handling
-   Tune the fraud threshold
-   Evaluate Precision, Recall, F1, ROC-AUC and PR-AUC
-   Test on unseen transaction patterns
-   Improve probability calibration

## Phase 3 --- Advanced Explainability

-   SHAP visualisations
-   Global feature importance
-   Local feature importance
-   Feature interaction analysis
-   User behavioural baselines
-   Historical transaction comparisons
-   Analyst evidence chains
-   Confidence/uncertainty indicators

## Phase 4 --- Production-oriented Architecture

Potential upgrades:

-   PostgreSQL transaction storage
-   Authentication
-   Role-based access control
-   Secure secrets management
-   Structured logging
-   Monitoring
-   Rate limiting
-   API versioning
-   Model version tracking
-   Audit trails
-   Background processing

## Phase 5 --- Real-time Fraud Intelligence

Potential future capabilities:

-   Real-time transaction streams
-   Device fingerprinting
-   IP intelligence
-   Behavioural anomaly detection
-   Advanced velocity detection
-   Recipient relationship graphs
-   Mule-account network detection
-   Fraud analyst case management
-   Real-time alerts

## Phase 6 --- Continuous Model Improvement

A mature system could introduce:

``` text
Transaction
    ↓
Fraud Model
    ↓
Risk Decision
    ↓
Analyst Review
    ↓
Confirmed Fraud / Legitimate
    ↓
Validated Training Data
    ↓
Model Evaluation
    ↓
New Model Version
```

Any retraining workflow would require proper validation, monitoring,
versioning, and approval before deployment.

------------------------------------------------------------------------

# Security & Production Disclaimer

This project is a **hackathon prototype** and is not intended to:

-   Make real banking decisions
-   Process real customer financial information
-   Replace a bank's fraud infrastructure
-   Serve as a production financial-security system

Do not submit real sensitive banking/customer information to the public
deployment.

A production implementation would require stronger:

-   Authentication
-   Authorization
-   Encryption
-   Data privacy controls
-   Secrets management
-   Audit logging
-   Model governance
-   Monitoring
-   Reliability engineering
-   Regulatory compliance
-   False-positive/false-negative analysis

------------------------------------------------------------------------

# Project Philosophy

> **A fraud prediction is more useful when the system can explain why it
> reached that prediction.**

Fraud Explainer combines machine learning, explainability, generative
AI, and product design to demonstrate this idea in a banking-focused use
case.

The current version is a hackathon prototype with known limitations. The
long-term goal is to evolve it into a more robust, explainable,
real-time fraud-risk platform.

------------------------------------------------------------------------

## Links

**GitHub:**\
https://github.com/Code-With-Lavanya/fraud_explainer

**Backend:**\
https://fraud-explainer.onrender.com

**API Docs:**\
https://fraud-explainer.onrender.com/docs

------------------------------------------------------------------------

## Built for Build & Bank

**Fraud Explainer --- Detect. Explain. Act.**

**Lavanya Singh · Aman Anand · Sasang Sitlhou**
