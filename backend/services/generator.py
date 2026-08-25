import random
import uuid
from datetime import datetime, timezone

from services.scenarios import (
    normal_scenario,
    account_takeover_scenario,
    rapid_transfer_scenario,
    remote_access_scenario,
    suspicious_recipient_scenario,
    mule_account_scenario
)


USERS = [
    "U_SIM_001",
    "U_SIM_002",
    "U_SIM_003",
    "U_SIM_004",
    "U_SIM_005",
]


USER_LOCATIONS = {

    "U_SIM_001": "Delhi",
    "U_SIM_002": "Gurugram",
    "U_SIM_003": "Noida",
    "U_SIM_004": "Mumbai",
    "U_SIM_005": "Pune",

}


USER_DEVICES = {

    "U_SIM_001": "DEV-SIM-001",
    "U_SIM_002": "DEV-SIM-002",
    "U_SIM_003": "DEV-SIM-003",
    "U_SIM_004": "DEV-SIM-004",
    "U_SIM_005": "DEV-SIM-005",

}



def generate_device(
    user_id,
    mode
):

    if mode == "known":

        return USER_DEVICES.get(
            user_id,
            f"DEV-{user_id}"
        )

    return (
        "NEW-DEV-"
        +
        uuid.uuid4().hex[:8].upper()
    )


def generate_location(
    user_id,
    mode
):

    known_location = USER_LOCATIONS.get(
        user_id,
        "Delhi"
    )

    if mode == "known":

        return known_location

    locations = [
        "Delhi",
        "Gurugram",
        "Noida",
        "Mumbai",
        "Pune"
    ]

    alternatives = [

        location

        for location in locations

        if location != known_location

    ]

    return random.choice(
        alternatives
    )



def generate_ip(
    mode
):

    prefix = {

        "normal":
            "SAFE",

        "medium":
            "MED",

        "high":
            "RISK"

    }.get(
        mode,
        "SAFE"
    )

    return (
        prefix
        +
        "-"
        +
        uuid.uuid4().hex[:8].upper()
    )



def generate_transaction(
    scenario=None
):


    user_id = random.choice(
        USERS
    )


    transaction_id = (
        "TXN-"
        +
        uuid.uuid4().hex[:10].upper()
    )


    if scenario is None:

        scenario = random.choices(

            [
                "normal",
                "account_takeover",
                "rapid_transfer",
                "remote_access",
                "suspicious_recipient",
                "mule_account"
            ],

            weights=[
                80,
                4,
                5,
                3,
                5,
                3
            ],

            k=1

        )[0]

    scenario_functions = {

        "normal":
            normal_scenario,

        "account_takeover":
            account_takeover_scenario,

        "rapid_transfer":
            rapid_transfer_scenario,

        "remote_access":
            remote_access_scenario,

        "suspicious_recipient":
            suspicious_recipient_scenario,

        "mule_account":
            mule_account_scenario

    }

    if scenario not in scenario_functions:

        raise ValueError(
            f"Unknown scenario: {scenario}"
        )


    data = scenario_functions[
        scenario
    ]()


    if scenario == "normal":

        recipient_id = (
            "REC-KNOWN-"
            +
            str(
                random.randint(
                    1,
                    5
                )
            )
        )

    else:

        recipient_id = (
            "REC-"
            +
            uuid.uuid4().hex[:8].upper()
        )


    timestamp = datetime.now(
        timezone.utc
    )


    transaction = {

        "transaction_id":
            transaction_id,

        "user_id":
            user_id,

        "sender_name":
            data["sender_name"],

        "recipient_id":
            recipient_id,

        "recipient_name":
            data["recipient_name"],

        "amount":
            float(data["amount"]),

        "device_id":
            generate_device(
                user_id,
                data["device_mode"]
            ),

        "ip_address":
            generate_ip(
                data["ip_mode"]
            ),

        "location":
            generate_location(
                user_id,
                data["location_mode"]
            ),

        "timestamp":
            timestamp.isoformat(),

        "account_age_days":
            data["account_age_days"],

        "failed_attempts":
            data["failed_attempts"],

        "remote_access_flag":
            data["remote_access_flag"],

        "mule_account_link":
            data["mule_account_link"],

        "_scenario":
            scenario

    }

    return transaction