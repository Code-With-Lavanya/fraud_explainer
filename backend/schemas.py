from datetime import datetime

from pydantic import BaseModel, Field


class TransactionFeatures(BaseModel):

    amount: float = Field(gt=0)
    avg_amount_30d: float = Field(ge=0)
    amount_deviation: float = Field(ge=0)

    hour: int = Field(ge=0, le=23)
    is_night: int = Field(ge=0, le=1)

    account_age_days: int = Field(ge=0)
    new_account: int = Field(ge=0, le=1)

    device_change: int = Field(ge=0, le=1)
    location_change: int = Field(ge=0, le=1)

    failed_attempts: int = Field(ge=0)

    new_recipient: int = Field(ge=0, le=1)

    recipient_transaction_count: int = Field(ge=0)

    new_recipient_low_history: int = Field(
        ge=0,
        le=1
    )

    velocity_10min: int = Field(ge=0)
    velocity_24h: int = Field(ge=0)

    unique_recipients_10min: int = Field(
        ge=0
    )

    unique_recipients_24h: int = Field(
        ge=0
    )

    normal_velocity_10min: float = Field(
        ge=0
    )

    normal_velocity_24h: float = Field(
        ge=0
    )

    velocity_deviation_10min: float = Field(
        ge=0
    )

    velocity_deviation_24h: float = Field(
        ge=0
    )

    recipient_frequency_ratio: float = Field(
        ge=0
    )

    high_velocity_10min: int = Field(
        ge=0,
        le=1
    )

    high_velocity_24h: int = Field(
        ge=0,
        le=1
    )

    remote_access_flag: int = Field(
        ge=0,
        le=1
    )

    mule_account_link: int = Field(
        ge=0,
        le=1
    )

    ip_risk_score: float = Field(
        ge=0,
        le=100
    )

    high_value_transaction: int = Field(
        ge=0,
        le=1
    )



class TransactionRequest(BaseModel):

    transaction_id: str

    user_id: str

    sender_name: str

    recipient_id: str
    recipient_name: str

    amount: float = Field(gt=0)

    device_id: str

    ip_address: str

    location: str

    timestamp: datetime

    account_age_days: int = Field(
        default=365,
        ge=0
    )

    failed_attempts: int = Field(
        default=0,
        ge=0
    )

    remote_access_flag: int = Field(
        default=0,
        ge=0,
        le=1
    )

    mule_account_link: int = Field(
        default=0,
        ge=0,
        le=1
    )


class LLMExplanationResponse(BaseModel):

    summary: str

    why_flagged: list[str]

    recommended_action_reason: str

    analyst_note: str