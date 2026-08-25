from datetime import datetime, timedelta

from schemas import TransactionRequest


class TransactionStore:

    def __init__(self):

        self.transactions: list[
            TransactionRequest
        ] = []
        self.results: dict[str, dict] = {}


    def add_transaction(
        self,
        transaction: TransactionRequest
    ):

        self.transactions.append(
            transaction
        )

        return transaction


    def add_result(
        self,
        transaction_id: str,
        result: dict
    ):

        self.results[transaction_id] = result


    def get_all_transactions(self):

        return list(
            self.transactions
        )


    def get_recent(self, limit: int = 14):
        """
        Newest-first list of transactions merged with their scored
        result (if one was recorded). Powers GET /transactions.
        """

        recent = list(
            reversed(self.transactions)
        )[:limit]

        out = []

        for tx in recent:

            result = self.results.get(
                tx.transaction_id,
                {}
            )

            out.append({
                "transaction_id": tx.transaction_id,
                "sender": tx.sender_name,
                "recipient": tx.recipient_name,
                "amount": tx.amount,
                "device_id": tx.device_id,
                "location": tx.location,
                "timestamp": tx.timestamp.isoformat(),
                **result,
            })

        return out


    def get_user_history(
        self,
        user_id: str
    ):

        return [
            tx
            for tx in self.transactions
            if tx.user_id == user_id
        ]


    def get_recent_user_transactions(
        self,
        user_id: str,
        timestamp: datetime,
        minutes: int = 10
    ):

        if timestamp.tzinfo is None:

            timestamp = timestamp.replace(
                tzinfo=None
            )

        cutoff = (
            timestamp
            -
            timedelta(
                minutes=minutes
            )
        )

        recent = []

        for tx in self.transactions:

            tx_timestamp = tx.timestamp

            # Normalize timezone handling
            if (
                timestamp.tzinfo is not None
                and
                tx_timestamp.tzinfo is None
            ):

                tx_timestamp = (
                    tx_timestamp.replace(
                        tzinfo=timestamp.tzinfo
                    )
                )

            elif (
                timestamp.tzinfo is None
                and
                tx_timestamp.tzinfo is not None
            ):

                tx_timestamp = (
                    tx_timestamp.replace(
                        tzinfo=None
                    )
                )

            if (
                tx.user_id == user_id
                and
                cutoff <= tx_timestamp < timestamp
            ):

                recent.append(tx)

        return recent



    def get_user_transactions_24h(
        self,
        user_id: str,
        timestamp: datetime
    ):

        return self.get_recent_user_transactions(
            user_id=user_id,
            timestamp=timestamp,
            minutes=1440
        )


    def get_recipient_history(
        self,
        recipient_id: str
    ):

        return [
            tx
            for tx in self.transactions
            if tx.recipient_id == recipient_id
        ]


    def clear(self):

        self.transactions.clear()


    def count(self):

        return len(
            self.transactions
        )



transaction_store = TransactionStore()