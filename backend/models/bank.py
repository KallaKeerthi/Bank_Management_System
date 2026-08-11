"""
BANK Attributes:

bank_name
branch
address
ifsc_code
accounts

BANK Methods:

create_account()
delete_account()
search_account()
get_account()
view_all_accounts()
"""

from .account import Account
from database.account_db import (
    create_account as db_create_account,
    delete_account as db_delete_account,
    get_account as db_get_account,
    get_all_accounts
)


class Bank:

    def __init__(
        self,
        bank_name,
        branch,
        address,
        ifsc_code,
        accounts=None
    ):
        self.bank_name = bank_name
        self.branch = branch
        self.address = address
        self.ifsc_code = ifsc_code

        if accounts is None:
            self.accounts = {}
        else:
            self.accounts = accounts


    def generate_account_number(self):

        accounts = get_all_accounts()

        if not accounts:
            return 10001

        return max(
            account["account_number"]
            for account in accounts
        ) + 1


    def create_account(
        self,
        first_name,
        last_name,
        age,
        phone,
        address,
        pin,
        balance
    ):

        new_account_number = self.generate_account_number()

        account = Account(
            new_account_number,
            first_name,
            last_name,
            age,
            phone,
            address,
            pin,
            balance
        )

        db_create_account(
            account.account_number,
            account.first_name,
            account.last_name,
            account.age,
            account.phone,
            account.address,
            account._Account__pin,
            account.balance
        )

        return account


    def delete_account(self, account_number):

        account = self.search_account(account_number)

        if account is None:
            return None

        deleted = db_delete_account(account_number)

        if deleted:
            return account

        return None


    def search_account(self, account_number):

        account_data = db_get_account(account_number)

        if account_data is None:
            return None

        return Account(
            account_data["account_number"],
            account_data["first_name"],
            account_data["last_name"],
            account_data["age"],
            account_data["phone"],
            account_data["address"],
            account_data["pin_hash"],
            account_data["balance"],
            history=[],
            pin_hashed=True
        )


    def get_account(self, account_number):

        return self.search_account(account_number)


    def view_all_accounts(self):

        accounts_data = get_all_accounts()

        accounts = []

        for account_data in accounts_data:

            account = Account(
                account_data["account_number"],
                account_data["first_name"],
                account_data["last_name"],
                account_data["age"],
                account_data["phone"],
                account_data["address"],
                account_data["pin_hash"],
                account_data["balance"],
                history=[],
                pin_hashed=True
            )

            accounts.append(account)

        return accounts


    def bank_details(self):

        return (
            f"Bank Details:\n"
            f"Bank Name: {self.bank_name}\n"
            f"Branch: {self.branch}\n"
            f"Address: {self.address}\n"
            f"IFSC Code: {self.ifsc_code}"
        )