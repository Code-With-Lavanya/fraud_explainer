import time

import requests

from services.generator import (
    generate_transaction
)


API_URL = (
    "http://127.0.0.1:8000/transactions"
)


def send_transaction(
    scenario=None
):

    event = generate_transaction(
        scenario
    )

    payload = {
        key: value
        for key, value in event.items()
        if not key.startswith("_")
    }

    response = requests.post(

        API_URL,

        json=payload,

        timeout=60
    )

    return (
        event,
        response
    )


def main():

    print(
        "\n"
        +
        "=" * 70
    )

    print(
        " REAL-TIME FRAUD SIMULATOR "
    )

    print(
        "=" * 70
    )

    for index in range(30):

        try:

            event, response = (
                send_transaction()
            )

            print(
                f"\n#{index + 1}"
            )

            print(
                f"Scenario: "
                f"{event['_scenario']}"
            )

            print(
                f"{event['sender_name']}"
                f" -> "
                f"{event['recipient_name']}"
            )

            print(
                f"Amount: "
                f"₹{event['amount']:,.2f}"
            )

            if response.ok:

                result = (
                    response.json()
                )

                print(
                    f"Risk: "
                    f"{result['risk_level']}"
                )

                print(
                    f"Probability: "
                    f"{result['fraud_probability_percent']:.2f}%"
                )

                print(
                    f"Action: "
                    f"{result['recommended_action']}"
                )

            else:

                print(
                    "API ERROR:"
                )

                print(
                    response.text
                )

        except Exception as e:

            print(
                "Simulator error:",
                repr(e)
            )

        time.sleep(2)


if __name__ == "__main__":

    main()