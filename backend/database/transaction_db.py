from database.connection import get_connection


def add_transaction(
    account_number,
    transaction_type,
    amount,
    balance_after,
    related_account=None
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = """
            INSERT INTO transactions
            (
                account_number,
                transaction_type,
                amount,
                balance_after,
                related_account
            )
            VALUES (%s, %s, %s, %s, %s)
        """

        cursor.execute(
            query,
            (
                account_number,
                transaction_type,
                amount,
                balance_after,
                related_account
            )
        )

        connection.commit()

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()


def get_transactions(account_number):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            transaction_id,
            account_number,
            transaction_type,
            amount,
            balance_after,
            related_account,
            created_at
        FROM transactions
        WHERE account_number = %s
        ORDER BY created_at DESC, transaction_id DESC
    """

    cursor.execute(query, (account_number,))

    transactions = cursor.fetchall()

    cursor.close()
    connection.close()

    return transactions


def deposit(account_number, amount):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            SELECT balance
            FROM accounts
            WHERE account_number = %s
            FOR UPDATE
            """,
            (account_number,)
        )

        account = cursor.fetchone()

        if account is None:
            connection.rollback()
            return False

        current_balance = float(account[0])

        if amount <= 0:
            connection.rollback()
            return False

        new_balance = current_balance + amount

        cursor.execute(
            """
            UPDATE accounts
            SET balance = %s
            WHERE account_number = %s
            """,
            (new_balance, account_number)
        )

        cursor.execute(
            """
            INSERT INTO transactions
            (
                account_number,
                transaction_type,
                amount,
                balance_after
            )
            VALUES (%s, %s, %s, %s)
            """,
            (
                account_number,
                "Deposit",
                amount,
                new_balance
            )
        )

        connection.commit()

        return True

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()


def withdraw(account_number, amount):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            SELECT balance
            FROM accounts
            WHERE account_number = %s
            FOR UPDATE
            """,
            (account_number,)
        )

        account = cursor.fetchone()

        if account is None:
            connection.rollback()
            return False

        current_balance = float(account[0])

        if amount <= 0 or current_balance < amount:
            connection.rollback()
            return False

        new_balance = current_balance - amount

        cursor.execute(
            """
            UPDATE accounts
            SET balance = %s
            WHERE account_number = %s
            """,
            (new_balance, account_number)
        )

        cursor.execute(
            """
            INSERT INTO transactions
            (
                account_number,
                transaction_type,
                amount,
                balance_after
            )
            VALUES (%s, %s, %s, %s)
            """,
            (
                account_number,
                "Withdraw",
                amount,
                new_balance
            )
        )

        connection.commit()

        return True

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()


def transfer(sender_account, receiver_account, amount):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        if sender_account == receiver_account:
            connection.rollback()
            return False

        if amount <= 0:
            connection.rollback()
            return False

        # Lock sender and receiver rows
        cursor.execute(
            """
            SELECT account_number, balance
            FROM accounts
            WHERE account_number IN (%s, %s)
            ORDER BY account_number
            FOR UPDATE
            """,
            (
                sender_account,
                receiver_account
            )
        )

        accounts = cursor.fetchall()

        if len(accounts) != 2:
            connection.rollback()
            return False

        balances = {
            account[0]: float(account[1])
            for account in accounts
        }

        sender_balance = balances[sender_account]
        receiver_balance = balances[receiver_account]

        if sender_balance < amount:
            connection.rollback()
            return False

        new_sender_balance = sender_balance - amount
        new_receiver_balance = receiver_balance + amount

        # Update sender
        cursor.execute(
            """
            UPDATE accounts
            SET balance = %s
            WHERE account_number = %s
            """,
            (
                new_sender_balance,
                sender_account
            )
        )

        # Update receiver
        cursor.execute(
            """
            UPDATE accounts
            SET balance = %s
            WHERE account_number = %s
            """,
            (
                new_receiver_balance,
                receiver_account
            )
        )

        # Sender transaction
        cursor.execute(
            """
            INSERT INTO transactions
            (
                account_number,
                transaction_type,
                amount,
                balance_after,
                related_account
            )
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                sender_account,
                f"Transfer to {receiver_account}",
                amount,
                new_sender_balance,
                receiver_account
            )
        )

        # Receiver transaction
        cursor.execute(
            """
            INSERT INTO transactions
            (
                account_number,
                transaction_type,
                amount,
                balance_after,
                related_account
            )
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                receiver_account,
                f"Received from {sender_account}",
                amount,
                new_receiver_balance,
                sender_account
            )
        )

        connection.commit()

        return True

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()