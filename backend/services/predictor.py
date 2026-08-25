from pathlib import Path

import joblib
import pandas as pd



BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)

MODEL_DIR = (
    BASE_DIR / "model"
)

MODEL_PATH = (
    MODEL_DIR /
    "fraud_model_calibrated.joblib"
)

FEATURES_PATH = (
    MODEL_DIR /
    "feature_columns.joblib"
)

THRESHOLD_PATH = (
    MODEL_DIR /
    "fraud_threshold.joblib"
)



model = joblib.load(
    MODEL_PATH
)

feature_columns = joblib.load(
    FEATURES_PATH
)

threshold = float(
    joblib.load(
        THRESHOLD_PATH
    )
)


print(
    "=============================================="
)

print(
    " FRAUD MODEL LOADED"
)

print(
    "=============================================="
)

print(
    f"Features : {len(feature_columns)}"
)

print(
    f"Threshold: {threshold}"
)

print(
    "=============================================="
)



def prepare_features(
    features: pd.DataFrame
):

    missing = [
        column
        for column in feature_columns
        if column not in features.columns
    ]

    if missing:

        raise ValueError(
            "Missing features required by model: "
            +
            ", ".join(missing)
        )

    X = features[
        feature_columns
    ].copy()

    return X



def predict_features(
    features: pd.DataFrame
):

    X = prepare_features(
        features
    )

    probability = float(
        model.predict_proba(
            X
        )[0][1]
    )

    prediction = int(
        probability >= threshold
    )

    return {

        "probability":
            probability,

        "prediction":
            prediction,

        "features":
            X
    }



def get_risk_level(
    probability: float
):

    if probability < 0.20:

        return "LOW RISK"

    if probability < threshold:

        return "MEDIUM RISK"

    return "HIGH RISK"



def get_action(
    probability: float
):

    if probability < 0.20:

        return "PROCEED"

    if probability < threshold:

        return "VERIFY PAYMENT"

    return "PAUSE PAYMENT"



def get_model():

    return model