import shap


FEATURE_LABELS = {

    "amount":
        "Payment amount",

    "avg_amount_30d":
        "30-day average amount",

    "amount_deviation":
        "Amount deviation",

    "hour":
        "Transaction hour",

    "is_night":
        "Night-time transaction",

    "account_age_days":
        "Account age",

    "new_account":
        "New account",

    "device_change":
        "Device change",

    "location_change":
        "Location change",

    "failed_attempts":
        "Failed payment attempts",

    "new_recipient":
        "New recipient",

    "recipient_transaction_count":
        "Recipient transaction history",

    "new_recipient_low_history":
        "New recipient with limited history",

    "velocity_10min":
        "10-minute transaction velocity",

    "velocity_24h":
        "24-hour transaction velocity",

    "unique_recipients_10min":
        "Unique recipients in 10 minutes",

    "unique_recipients_24h":
        "Unique recipients in 24 hours",

    "normal_velocity_10min":
        "Normal 10-minute velocity",

    "normal_velocity_24h":
        "Normal 24-hour velocity",

    "velocity_deviation_10min":
        "10-minute velocity deviation",

    "velocity_deviation_24h":
        "24-hour velocity deviation",

    "recipient_frequency_ratio":
        "Recipient transaction frequency",

    "high_velocity_10min":
        "High 10-minute velocity",

    "high_velocity_24h":
        "High 24-hour velocity",

    "remote_access_flag":
        "Remote-access activity",

    "mule_account_link":
        "Mule-account connection",

    "ip_risk_score":
        "IP/network risk",

    "high_value_transaction":
        "High-value transaction"
}


# ============================================================
# SHAP
# ============================================================

def get_shap_contributors(
    model,
    X,
    top_n=8
):

    # --------------------------------------------------------
    # Extract underlying XGBoost model
    # --------------------------------------------------------

    if hasattr(
        model,
        "estimator"
    ):

        base_model = (
            model.estimator
        )

    else:

        base_model = model

    # --------------------------------------------------------
    # SHAP TreeExplainer
    # --------------------------------------------------------

    explainer = shap.TreeExplainer(
        base_model
    )

    # --------------------------------------------------------
    # SHAP VALUES
    # --------------------------------------------------------

    shap_values = (
        explainer.shap_values(X)
    )

    if isinstance(
        shap_values,
        list
    ):

        shap_values = (
            shap_values[1]
        )

    shap_values = shap_values[0]

    # --------------------------------------------------------
    # CONTRIBUTORS
    # --------------------------------------------------------

    feature_values = (
        X.iloc[0]
    )

    contributors = []

    for (
        feature,
        value,
        shap_value
    ) in zip(
        X.columns,
        feature_values,
        shap_values
    ):

        contributors.append({

            "feature":
                feature,

            "label":
                FEATURE_LABELS.get(
                    feature,
                    feature
                    .replace(
                        "_",
                        " "
                    )
                    .title()
                ),

            "value":
                float(value),

            "shap_value":
                float(shap_value),

            "direction":
                (
                    "increases_risk"
                    if shap_value > 0
                    else
                    "reduces_risk"
                )
        })

    # Strongest first
    contributors.sort(
        key=lambda item:
            abs(
                item["shap_value"]
            ),
        reverse=True
    )

    return contributors[
        :top_n
    ]


# ============================================================
# HUMAN-READABLE SIGNALS
# ============================================================

def generate_signals(
    transaction: dict
):

    increasing = []
    reducing = []

    # --------------------------------------------------------
    # Recipient
    # --------------------------------------------------------

    if transaction.get(
        "new_recipient",
        0
    ) == 1:

        increasing.append(
            "This payment is being sent to a new recipient."
        )

    else:

        reducing.append(
            "The recipient has been used previously."
        )

    # --------------------------------------------------------
    # Device
    # --------------------------------------------------------

    if transaction.get(
        "device_change",
        0
    ) == 1:

        increasing.append(
            "The payment was made from a newly changed device."
        )

    else:

        reducing.append(
            "The payment was made from a known device."
        )

    # --------------------------------------------------------
    # Location
    # --------------------------------------------------------

    if transaction.get(
        "location_change",
        0
    ) == 1:

        increasing.append(
            "The transaction location differs from previous activity."
        )

    else:

        reducing.append(
            "The transaction location is consistent with previous activity."
        )

    # --------------------------------------------------------
    # Remote access
    # --------------------------------------------------------

    if transaction.get(
        "remote_access_flag",
        0
    ) == 1:

        increasing.append(
            "Remote-access activity was detected during the transaction."
        )

    # --------------------------------------------------------
    # Mule
    # --------------------------------------------------------

    if transaction.get(
        "mule_account_link",
        0
    ) == 1:

        increasing.append(
            "The recipient shows a potential connection to a mule-account pattern."
        )

    else:

        reducing.append(
            "No mule-account connection was detected."
        )

    # --------------------------------------------------------
    # Failed attempts
    # --------------------------------------------------------

    failed = transaction.get(
        "failed_attempts",
        0
    )

    if failed > 0:

        increasing.append(
            f"There were {int(failed)} failed payment attempts before this transaction."
        )

    else:

        reducing.append(
            "No failed payment attempts were detected."
        )


    velocity_10min = transaction.get(
        "velocity_10min",
        0
    )

    if velocity_10min >= 8:

        increasing.append(
            f"{int(velocity_10min)} transactions occurred within the last 10 minutes."
        )

    elif velocity_10min <= 2:

        reducing.append(
            f"Transaction activity over the last 10 minutes is normal ({velocity_10min:.1f} transactions)."
        )


    velocity_24h = transaction.get(
        "velocity_24h",
        0
    )

    if velocity_24h >= 20:

        increasing.append(
            f"{int(velocity_24h)} transactions were recorded within the last 24 hours."
        )

    elif velocity_24h <= 8:

        reducing.append(
            f"Transaction activity over the last 24 hours is within the normal range ({velocity_24h:.1f})."
        )


    unique_10min = transaction.get(
        "unique_recipients_10min",
        0
    )

    if unique_10min >= 5:

        increasing.append(
            f"{int(unique_10min)} different recipients were involved within the last 10 minutes."
        )

    unique_24h = transaction.get(
        "unique_recipients_24h",
        0
    )

    if unique_24h >= 10:

        increasing.append(
            f"{int(unique_24h)} different recipients were involved within the last 24 hours."
        )



    ip_risk = transaction.get(
        "ip_risk_score",
        0
    )

    if ip_risk >= 70:

        increasing.append(
            "The network/IP associated with this payment shows elevated risk."
        )

    elif ip_risk <= 30:

        reducing.append(
            "The network/IP associated with this payment shows relatively low risk."
        )


    account_age = transaction.get(
        "account_age_days",
        0
    )

    if account_age < 90:

        increasing.append(
            f"The account is relatively new ({int(account_age)} days old)."
        )

    elif account_age >= 365:

        reducing.append(
            f"The account is {int(account_age)} days old."
        )


    deviation = transaction.get(
        "amount_deviation",
        0
    )

    if deviation >= 2:

        increasing.append(
            "The payment amount is significantly different from the account's usual transaction pattern."
        )

    elif deviation <= 1.5:

        reducing.append(
            "The payment amount is close to the account's usual transaction pattern."
        )

    return (
        increasing[:5],
        reducing[:5]
    )