"""

BANK Attributes:

Attributes
----------

bank_name
branch
address
ifsc_code
accounts

BANK Methods

Methods
-------

create_account()
delete_account()
search_account()
get_account()
view_all_accounts()
load_accounts()
save_accounts()

"""

from .account import Account
import json

class Bank:
    def __init__(self, bank_name, branch, address, ifsc_code, accounts=None):
        self.bank_name = bank_name
        self.branch = branch
        self.address = address
        self.ifsc_code = ifsc_code
        if accounts is None:
            self.accounts = {}
        else:
            self.accounts = accounts
            
    def generate_account_number(self):
        if not self.accounts:
            return 10001
        return max(self.accounts.keys())+1
        
    def create_account(self, first_name, last_name, age, phone, address, pin, balance):
        new_account_number = self.generate_account_number()
        account = Account(new_account_number, first_name, last_name, age, phone, address, pin, balance)
        self.accounts[new_account_number] = account
        self.save_accounts()
        return account
    
    def delete_account(self, account_number):
        deleted = self.accounts.pop(account_number, None)
        self.save_accounts()
        return deleted
    
    def search_account(self, account_number):
        return self.accounts.get(account_number)    
    
    def get_account(self):
        return self.accounts.keys()
    
    def view_all_accounts(self):
        return self.accounts.values()
    
    def load_accounts(self):
        try:
            with open("data/accounts.json","r") as file:
                data = json.load(file)
            for acc_no, account_data in data.items():
                account = Account(
                    account_data["account_number"],
                    account_data["first_name"],
                    account_data["last_name"],
                    account_data["age"],
                    account_data["phone"],
                    account_data["address"],
                    account_data["pin"],
                    account_data["balance"],
                    account_data.get("history", [])
                )
                self.accounts[int(acc_no)] = account
        except (FileNotFoundError, json.JSONDecodeError):
            self.accounts = {}
    
    def save_accounts(self):
        data = {}
        for acc_no, account in self.accounts.items():
            data[str(acc_no)] = account.to_dict()
        with open("data/accounts.json","w") as file:
            json.dump(data,file,indent=4)
    
    def bank_details(self):
        return f"Bank Details:\nBank Name: {self.bank_name}\nBranch: {self.branch}\nAddress: {self.address}\nIFSC Code: {self.ifsc_code}"