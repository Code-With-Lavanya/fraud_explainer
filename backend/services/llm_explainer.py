import os

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel, Field


load_dotenv()

API_KEY = os.getenv(
    "GEMINI_API_KEY"
)

if not API_KEY:

    raise RuntimeError(
        "GEMINI_API_KEY not found in environment variables."
    )


client = genai.Client(
    api_key=API_KEY
)



class LLMExplanation(
    BaseModel
):

    summary: str = Field(
        description=(
            "A concise 1-2 sentence explanation "
            "of the transaction risk."
        )
    )

    why_flagged: list[str] = Field(
        description=(
            "The most important reasons affecting "
            "the risk. Use simple language."
        )
    )

    recommended_action_reason: str = Field(
        description=(
            "Explain why the recommended action "
            "is appropriate."
        )
    )

    analyst_note: str = Field(
        description=(
            "A short professional fraud analyst "
            "style note."
        )
    )



SYSTEM_PROMPT = """

You are an AI fraud analyst explaining the output
of a UPI fraud detection system.

IMPORTANT RULES:

1. The machine learning model is the source of truth.
2. Never change the fraud prediction.
3. Never change the fraud probability.
4. Never invent transaction information.
5. Use ONLY the information provided.
6. Do not claim that a transaction is definitely fraudulent
   merely because the model classified it as fraud.
7. Explain the strongest behavioural signals clearly.
8. Avoid technical ML terminology such as:
   SHAP, XGBoost, feature engineering, embeddings.
9. Use simple language suitable for a fraud analyst
   or banking operations employee.
10. Keep the explanation concise and professional.
11. Do not provide legal or financial advice.

The model has already determined:
- fraud probability
- fraud prediction
- risk level
- recommended action

Your job is ONLY to explain the result.

"""


def generate_llm_explanation(
    probability: float,
    prediction: int,
    risk_level: str,
    recommended_action: str,
    risk_increasing_signals: list[str],
    risk_reducing_signals: list[str],
    shap_contributors: list[dict]
):

    prompt = f"""
{SYSTEM_PROMPT}

MODEL RESULT
------------

Fraud Probability:
{probability * 100:.2f}%

Prediction:
{prediction}

Risk Level:
{risk_level}

Recommended Action:
{recommended_action}


RISK-INCREASING SIGNALS
-----------------------

{
    chr(10).join(
        f"- {signal}"
        for signal in risk_increasing_signals
    )
}


RISK-REDUCING SIGNALS
---------------------

{
    chr(10).join(
        f"- {signal}"
        for signal in risk_reducing_signals
    )
}


MODEL CONTRIBUTIONS
-------------------

The following are the strongest factors
identified by the fraud detection model.

{
    chr(10).join(
        f"- {item['label']}: "
        f"value={item['value']:.2f}, "
        f"impact={item['direction']}, "
        f"strength={item['shap_value']:.4f}"
        for item in shap_contributors
    )
}

TASK
----

Explain the transaction for a human fraud analyst.

Focus on:

1. Why the transaction received this risk level.
2. The strongest suspicious signals.
3. Any meaningful signals supporting legitimacy.
4. Why the recommended action makes sense.

Do NOT change the model's decision.

Do NOT expose SHAP values to the end user.

Do NOT say the model is absolutely certain.
"""


    response = client.models.generate_content(

        model="gemini-3.1-flash-lite",

        contents=prompt,

        config={

            "response_mime_type":
                "application/json",

            "response_json_schema":
                LLMExplanation.model_json_schema()
        }
    )

    result = (
        LLMExplanation
        .model_validate_json(
            response.text
        )
    )

    return result.model_dump()