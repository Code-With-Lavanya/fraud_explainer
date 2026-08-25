import random


NAMES = [
    "Mohit Sharma",
    "Rahul Verma",
    "Aman Singh",
    "Priya Gupta",
    "Arjun Mehta",
    "Sakshi Jain",
    "Rohan Kapoor",
    "Neha Agarwal",
]


def normal_scenario():

    return {

        "sender_name":
            random.choice(NAMES),

        "recipient_name":
            random.choice(NAMES),

        "amount":
            round(
                random.uniform(
                    200,
                    2500
                ),
                2
            ),

        "device_mode":
            "known",

        "location_mode":
            "known",

        "ip_mode":
            "normal",

        "remote_access_flag":
            0,

        "mule_account_link":
            0,

        "failed_attempts":
            0,

        "account_age_days":
            random.randint(
                365,
                2000
            )
    }


def account_takeover_scenario():

    return {

        "sender_name":
            random.choice(NAMES),

        "recipient_name":
            random.choice(NAMES),

        "amount":
            round(
                random.uniform(
                    5000,
                    25000
                ),
                2
            ),

        "device_mode":
            "new",

        "location_mode":
            "new",

        "ip_mode":
            "medium",

        "remote_access_flag":
            0,

        "mule_account_link":
            0,

        "failed_attempts":
            random.randint(
                1,
                4
            ),

        "account_age_days":
            random.randint(
                300,
                2000
            )
    }



def rapid_transfer_scenario():

    return {

        "sender_name":
            random.choice(NAMES),

        "recipient_name":
            random.choice(NAMES),

        "amount":
            round(
                random.uniform(
                    1000,
                    9000
                ),
                2
            ),

        "device_mode":
            "known",

        "location_mode":
            "known",

        "ip_mode":
            "normal",

        "remote_access_flag":
            0,

        "mule_account_link":
            0,

        "failed_attempts":
            random.randint(
                0,
                2
            ),

        "account_age_days":
            random.randint(
                300,
                2000
            )
    }



def remote_access_scenario():

    return {

        "sender_name":
            random.choice(NAMES),

        "recipient_name":
            random.choice(NAMES),

        "amount":
            round(
                random.uniform(
                    3000,
                    18000
                ),
                2
            ),

        "device_mode":
            "new",

        "location_mode":
            "known",

        "ip_mode":
            "high",

        "remote_access_flag":
            1,

        "mule_account_link":
            0,

        "failed_attempts":
            random.randint(
                1,
                3
            ),

        "account_age_days":
            random.randint(
                300,
                2000
            )
    }



def suspicious_recipient_scenario():

    return {

        "sender_name":
            random.choice(NAMES),

        "recipient_name":
            random.choice(NAMES),

        "amount":
            round(
                random.uniform(
                    1500,
                    12000
                ),
                2
            ),

        "device_mode":
            "known",

        "location_mode":
            "known",

        "ip_mode":
            "medium",

        "remote_access_flag":
            0,

        "mule_account_link":
            0,

        "failed_attempts":
            random.randint(
                0,
                2
            ),

        "account_age_days":
            random.randint(
                300,
                2000
            )
    }


def mule_account_scenario():

    return {

        "sender_name":
            random.choice(NAMES),

        "recipient_name":
            random.choice(NAMES),

        "amount":
            round(
                random.uniform(
                    1000,
                    6000
                ),
                2
            ),

        "device_mode":
            "known",

        "location_mode":
            "known",

        "ip_mode":
            "medium",

        "remote_access_flag":
            0,

        "mule_account_link":
            1,

        "failed_attempts":
            random.randint(
                0,
                2
            ),

        "account_age_days":
            random.randint(
                300,
                2000
            )
    }