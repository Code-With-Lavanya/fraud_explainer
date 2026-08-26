from fastapi import (
    FastAPI,
    HTTPException
)
from fastapi.middleware.cors import CORSMiddleware

import os
import pandas as pd

from schemas import (
    TransactionFeatures,
    TransactionRequest
)

from services.predictor import (
    predict_features,
    get_risk_level,
    get_action,
    get_model
)

from services.feature_engineering import (
    build_features
)

from services.transaction_store import (
    transaction_store
)

from services.explainer import (
    generate_signals,
    get_shap_contributors
)

from services.llm_explainer import (
    generate_llm_explanation
)



app = FastAPI(

    title="Real-Time Fraud Explainer",

    description=(
        "Real-time UPI fraud detection and explanation "
        "using calibrated XGBoost, SHAP and Gemini."
    ),

    version="1.0.0"
)


_allowed_origins = os.getenv("ALLOWED_ORIGINS")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:8000",
        "https://fraud-explainer.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def root():

    return {

        "status": "online",

        "service":
            "Real-Time Fraud Explainer",

        "version":
            "1.0.0"
    }


@app.get("/health")
def health():

    return {

        "status":
            "healthy",

        "model":
            "loaded",

        "transactions_seen":
            transaction_store.count()
    }



@app.post("/predict")
def predict(
    transaction: TransactionFeatures
):

    try:



        transaction_data = (
            transaction.model_dump()
        )

        features = pd.DataFrame(
            [transaction_data]
        )


        result = predict_features(
            features
        )

        probability = (
            result["probability"]
        )

        prediction = (
            result["prediction"]
        )

        X = (
            result["features"]
        )


        risk_level = get_risk_level(
            probability
        )

        action = get_action(
            probability
        )


        increasing, reducing = (
            generate_signals(
                transaction_data
            )
        )



        shap_contributors = (
            get_shap_contributors(

                model=get_model(),

                X=X
            )
        )


        explanation = (
            generate_llm_explanation(

                probability=probability,

                prediction=prediction,

                risk_level=risk_level,

                recommended_action=action,

                risk_increasing_signals=
                    increasing,

                risk_reducing_signals=
                    reducing,

                shap_contributors=
                    shap_contributors
            )
        )

        return {

            "fraud_probability":
                round(
                    probability,
                    4
                ),

            "fraud_probability_percent":
                round(
                    probability * 100,
                    2
                ),

            "prediction":
                prediction,

            "risk_level":
                risk_level,

            "recommended_action":
                action,

            "risk_increasing_signals":
                increasing,

            "risk_reducing_signals":
                reducing,

            "explanation":
                explanation,

            "shap":
                shap_contributors
        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )



@app.get("/transactions")
def list_transactions(
    limit: int = 14
):

    return transaction_store.get_recent(
        limit
    )



@app.post("/transactions")
def process_transaction(
    transaction: TransactionRequest
):

    try:

        print(
            "\n"
            +
            "=" * 60
        )

        print(
            "NEW TRANSACTION"
        )

        print(
            f"ID: "
            f"{transaction.transaction_id}"
        )

        print(
            f"{transaction.sender_name}"
            f" -> "
            f"{transaction.recipient_name}"
        )

        print(
            f"Amount: "
            f"₹{transaction.amount:,.2f}"
        )

        print(
            "=" * 60
        )


        features = build_features(

            transaction=transaction,

            store=transaction_store
        )


        result = predict_features(
            features
        )

        probability = (
            result["probability"]
        )

        prediction = (
            result["prediction"]
        )

        X = (
            result["features"]
        )


        risk_level = get_risk_level(
            probability
        )

        action = get_action(
            probability
        )


        engineered_data = (
            features.iloc[0].to_dict()
        )

        increasing, reducing = (
            generate_signals(
                engineered_data
            )
        )


        shap_contributors = (
            get_shap_contributors(

                model=get_model(),

                X=X
            )
        )

        print(
            "\nSHAP CONTRIBUTORS:"
        )

        for item in shap_contributors:

            print(

                item["label"],

                "| value =",
                item["value"],

                "| shap =",
                round(
                    item["shap_value"],
                    4
                ),

                "|",
                item["direction"]
            )


        if prediction == 1:
            explanation = (
                generate_llm_explanation(

                    probability=probability,

                    prediction=prediction,

                    risk_level=risk_level,

                    recommended_action=action,

                    risk_increasing_signals=
                        increasing,

                    risk_reducing_signals=
                        reducing,

                    shap_contributors=
                        shap_contributors
                )
            )
        else:
             explanation = {
        "summary": "Transaction appears consistent with normal activity.",
        "why_flagged": [],
        "recommended_action_reason": "Payment can proceed.",
        "analyst_note": "No significant fraud indicators detected."
    }


        transaction_store.add_transaction(
            transaction
        )

        transaction_store.add_result(
            transaction.transaction_id,
            {
                "fraud_probability":
                    round(probability, 4),
                "fraud_probability_percent":
                    round(probability * 100, 2),
                "prediction":
                    prediction,
                "risk_level":
                    risk_level,
                "recommended_action":
                    action,
                "risk_increasing_signals":
                    increasing,
                "risk_reducing_signals":
                    reducing,
                "explanation":
                    explanation,
                "shap":
                    shap_contributors,
            }
        )


        print(
            f"Risk: "
            f"{risk_level}"
        )

        print(
            f"Probability: "
            f"{probability * 100:.2f}%"
        )

        print(
            f"Action: "
            f"{action}"
        )

        print(
            f"Transactions seen: "
            f"{transaction_store.count()}"
        )


        return {

            "transaction_id":
                transaction.transaction_id,

            "sender":
                transaction.sender_name,

            "recipient":
                transaction.recipient_name,

            "amount":
                transaction.amount,

            "fraud_probability":
                round(
                    probability,
                    4
                ),

            "fraud_probability_percent":
                round(
                    probability * 100,
                    2
                ),

            "prediction":
                prediction,

            "risk_level":
                risk_level,

            "recommended_action":
                action,

            "risk_increasing_signals":
                increasing,

            "risk_reducing_signals":
                reducing,

            "explanation":
                explanation,

            "shap":
                shap_contributors,

            "transactions_seen":
                transaction_store.count()
        }

    except Exception as e:

        import traceback

        print(
            "\n"
            +
            "=" * 70
        )

        print(
            "TRANSACTION PROCESSING ERROR"
        )

        print(
            "=" * 70
        )

        print(
            "ERROR:",
            repr(e)
        )

        traceback.print_exc()

        print(
            "=" * 70
            +
            "\n"
        )

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )