import pandas as pd
from datetime import datetime, timezone

from schemas import TransactionRequest



def get_value(obj, key, default=None):
    """
    Works with both:
    - Pydantic objects
    - dictionaries
    """

    if isinstance(obj, dict):
        return obj.get(key, default)

    return getattr(obj, key, default)


def parse_timestamp(value):
    """
    Convert timestamp into timezone-aware datetime.
    """

    if isinstance(value, datetime):

        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)

        return value

    if value is None:
        return datetime.now(timezone.utc)

    try:

        parsed = datetime.fromisoformat(
            str(value).replace("Z", "+00:00")
        )

        if parsed.tzinfo is None:
            parsed = parsed.replace(
                tzinfo=timezone.utc
            )

        return parsed

    except Exception:

        return datetime.now(timezone.utc)



def get_all_transactions(store):

    try:

        transactions = store.get_all_transactions()

        if transactions is None:
            return []

        return list(transactions)

    except Exception:

        return []



def build_features(
    transaction: TransactionRequest,
    store
) -> pd.DataFrame:


    current_user_id = transaction.user_id
    current_recipient_id = transaction.recipient_id

    current_timestamp = parse_timestamp(
        transaction.timestamp
    )

    current_amount = float(
        transaction.amount
    )


    all_transactions = get_all_transactions(
        store
    )

    user_history = []

    recent_10min = []

    recent_24h = []

    recipient_history = []

    for tx in all_transactions:

        tx_user_id = get_value(
            tx,
            "user_id"
        )

        tx_recipient_id = get_value(
            tx,
            "recipient_id"
        )

        tx_timestamp = parse_timestamp(
            get_value(
                tx,
                "timestamp"
            )
        )

        # User history
        if tx_user_id == current_user_id:

            user_history.append(tx)

            time_diff = (
                current_timestamp
                - tx_timestamp
            ).total_seconds()

            # Last 10 minutes
            if (
                0 <= time_diff <= 600
            ):

                recent_10min.append(tx)

            # Last 24 hours
            if (
                0 <= time_diff <= 86400
            ):

                recent_24h.append(tx)

        if (
            tx_recipient_id
            == current_recipient_id
        ):

            recipient_history.append(tx)


    account_age_days = get_value(
        transaction,
        "account_age_days",
        365
    )

    if account_age_days is None:

        account_age_days = 365

    account_age_days = float(
        account_age_days
    )


    historical_amounts = []

    for tx in user_history:

        amount = get_value(
            tx,
            "amount"
        )

        if amount is not None:

            try:

                historical_amounts.append(
                    float(amount)
                )

            except Exception:

                pass

    if historical_amounts:

        recent_amounts = (
            historical_amounts[-100:]
        )

        avg_amount_30d = (
            sum(recent_amounts)
            /
            len(recent_amounts)
        )

    else:

        avg_amount_30d = current_amount

    avg_amount_30d = max(
        avg_amount_30d,
        1.0
    )


    if user_history:

        days = max(
            account_age_days,
            1
        )

        avg_daily_txns = (
            len(user_history)
            /
            days
            *
            30
        )

    else:

        avg_daily_txns = 4.0

    avg_daily_txns = min(
        max(
            avg_daily_txns,
            1.0
        ),
        20.0
    )


    amount_deviation = (
        current_amount
        /
        (avg_amount_30d + 1)
    )


    current_device = get_value(
        transaction,
        "device_id",
        ""
    )

    known_devices = set()

    for tx in user_history:

        device = get_value(
            tx,
            "device_id"
        )

        if device:

            known_devices.add(
                device
            )

    if not user_history:

        device_change = 0

    else:

        device_change = int(
            current_device
            not in known_devices
        )


    current_location = get_value(
        transaction,
        "location",
        ""
    )

    known_locations = set()

    for tx in user_history:

        location = get_value(
            tx,
            "location"
        )

        if location:

            known_locations.add(
                location
            )

    if not user_history:

        location_change = 0

    else:

        location_change = int(
            current_location
            not in known_locations
        )


    failed_attempts = get_value(
        transaction,
        "failed_attempts",
        0
    )

    failed_attempts = float(
        failed_attempts or 0
    )


    recipient_used_before = any(

        get_value(
            tx,
            "recipient_id"
        )
        ==
        current_recipient_id

        for tx in user_history
    )

    new_recipient = int(
        not recipient_used_before
    )

    recipient_transaction_count = len(
        recipient_history
    )


    velocity_10min = (
        len(recent_10min)
        + 1
    )

    velocity_24h = (
        len(recent_24h)
        + 1
    )


    unique_recipients_10min = len({

        get_value(
            tx,
            "recipient_id"
        )

        for tx in recent_10min

        if get_value(
            tx,
            "recipient_id"
        ) is not None

    }) + 1

    unique_recipients_24h = len({

        get_value(
            tx,
            "recipient_id"
        )

        for tx in recent_24h

        if get_value(
            tx,
            "recipient_id"
        ) is not None

    }) + 1


    normal_velocity_10min = max(
        avg_daily_txns / 4,
        1
    )

    normal_velocity_24h = max(
        avg_daily_txns,
        1
    )


    velocity_deviation_10min = (
        velocity_10min
        /
        normal_velocity_10min
    )

    velocity_deviation_24h = (
        velocity_24h
        /
        normal_velocity_24h
    )


    recipient_frequency_ratio = (
        (recipient_transaction_count + 1)
        /
        max(
            avg_daily_txns * 2,
            1
        )
    )



    high_velocity_10min = int(
        velocity_10min >= 5
    )

    high_velocity_24h = int(
        velocity_24h >= 20
    )

    new_account = int(
        account_age_days <= 90
    )

    new_recipient_low_history = int(
        new_recipient == 1
        and
        recipient_transaction_count <= 3
    )

    high_value_transaction = int(
        amount_deviation >= 3
    )

    hour = current_timestamp.hour

    is_night = int(
        hour < 6
        or
        hour >= 23
    )


    ip_address = get_value(
        transaction,
        "ip_address",
        ""
    )

    ip_risk_score = calculate_ip_risk(
        ip_address
    )


    remote_access_flag = int(
        get_value(
            transaction,
            "remote_access_flag",
            0
        ) or 0
    )

    mule_account_link = int(
        get_value(
            transaction,
            "mule_account_link",
            0
        ) or 0
    )


    features = {

        "amount":
            current_amount,

        "avg_amount_30d":
            avg_amount_30d,

        "amount_deviation":
            amount_deviation,

        "hour":
            hour,

        "is_night":
            is_night,

        "account_age_days":
            account_age_days,

        "new_account":
            new_account,

        "device_change":
            device_change,

        "location_change":
            location_change,

        "failed_attempts":
            failed_attempts,

        "new_recipient":
            new_recipient,

        "recipient_transaction_count":
            recipient_transaction_count,

        "new_recipient_low_history":
            new_recipient_low_history,

        "velocity_10min":
            velocity_10min,

        "velocity_24h":
            velocity_24h,

        "unique_recipients_10min":
            unique_recipients_10min,

        "unique_recipients_24h":
            unique_recipients_24h,

        "normal_velocity_10min":
            normal_velocity_10min,

        "normal_velocity_24h":
            normal_velocity_24h,

        "velocity_deviation_10min":
            velocity_deviation_10min,

        "velocity_deviation_24h":
            velocity_deviation_24h,

        "recipient_frequency_ratio":
            recipient_frequency_ratio,

        "high_velocity_10min":
            high_velocity_10min,

        "high_velocity_24h":
            high_velocity_24h,

        "remote_access_flag":
            remote_access_flag,

        "mule_account_link":
            mule_account_link,

        "ip_risk_score":
            ip_risk_score,

        "high_value_transaction":
            high_value_transaction
    }

    df = pd.DataFrame(
        [features]
    )

    # Safety check
    if len(df.columns) != 28:

        raise ValueError(
            f"Expected 28 features, "
            f"but generated {len(df.columns)}"
        )

    return df


def calculate_ip_risk(
    ip_address: str
) -> float:

    ip_address = str(
        ip_address or ""
    )

    if ip_address.startswith(
        "RISK-"
    ):

        return 80.0

    if ip_address.startswith(
        "MED-"
    ):

        return 50.0

    return 10.0