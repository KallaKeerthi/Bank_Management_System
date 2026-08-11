from database.connection import get_connection


def create_account(
    account_number,
    first_name,
    last_name,
    age,
    phone,
    address,
    pin_hash,
    balance
):
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO accounts
        (
            account_number,
            first_name,
            last_name,
            age,
            phone,
            address,
            pin_hash,
            balance
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        account_number,
        first_name,
        last_name,
        age,
        phone,
        address,
        pin_hash,
        balance
    )

    cursor.execute(query, values)

    connection.commit()

    cursor.close()
    connection.close()


def get_account(account_number):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            account_number,
            first_name,
            last_name,
            age,
            phone,
            address,
            pin_hash,
            balance
        FROM accounts
        WHERE account_number = %s
    """

    cursor.execute(query, (account_number,))

    account = cursor.fetchone()

    cursor.close()
    connection.close()

    return account


def get_all_accounts():

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            account_number,
            first_name,
            last_name,
            age,
            phone,
            address,
            pin_hash,
            balance
        FROM accounts
        ORDER BY account_number
    """

    cursor.execute(query)

    accounts = cursor.fetchall()

    cursor.close()
    connection.close()

    return accounts


def delete_account(account_number):

    connection = get_connection()
    cursor = connection.cursor()

    query = """
        DELETE FROM accounts
        WHERE account_number = %s
    """

    cursor.execute(query, (account_number,))

    deleted = cursor.rowcount > 0

    connection.commit()

    cursor.close()
    connection.close()

    return deleted

def update_balance(account_number, new_balance):

    connection = get_connection()
    cursor = connection.cursor()

    query = """
        UPDATE accounts
        SET balance = %s
        WHERE account_number = %s
    """

    cursor.execute(
        query,
        (new_balance, account_number)
    )

    connection.commit()

    updated = cursor.rowcount > 0

    cursor.close()
    connection.close()

    return updated
def update_pin(account_number, pin_hash):

    connection = get_connection()
    cursor = connection.cursor()

    query = """
        UPDATE accounts
        SET pin_hash = %s
        WHERE account_number = %s
    """

    cursor.execute(
        query,
        (pin_hash, account_number)
    )

    connection.commit()

    updated = cursor.rowcount > 0

    cursor.close()
    connection.close()

    return updated