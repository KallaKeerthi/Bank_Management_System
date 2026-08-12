import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models.bank import Bank
from models.admin import Admin
from Services.auth import Authentication

from database.transaction_db import (
    deposit as db_deposit,
    withdraw as db_withdraw,
    transfer as db_transfer,
    get_transactions
)

from database.account_db import update_pin

import hashlib


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://bankmanagementsystem-liart.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# REQUEST MODELS
# =========================

class AccountCreate(BaseModel):
    first_name: str
    last_name: str
    age: int
    phone: str
    address: str
    pin: str
    balance: float


class AdminLogin(BaseModel):
    username: str
    password: str


class CustomerLogin(BaseModel):
    account_number: int
    pin: str


class AmountRequest(BaseModel):
    amount: float


class TransferRequest(BaseModel):
    receiver_account_number: int
    amount: float


class ChangePinRequest(BaseModel):
    current_pin: str
    new_pin: str


# =========================
# OBJECTS
# =========================

bank = Bank(
    "SBI",
    "HYD",
    "kukatpally",
    "jiujeh5b88"
)

admin = Admin(
    int(os.getenv("ADMIN_ID")),
    os.getenv("ADMIN_USERNAME"),
    os.getenv("ADMIN_PASSWORD")
)

auth = Authentication(
    admin,
    bank
)


# =========================
# HELPER
# =========================

def get_public_account(account):

    transactions = get_transactions(
        account.account_number
    )

    history = []

    for transaction in transactions:

        history.append({
            "date": transaction["created_at"].strftime(
                "%d-%m-%Y %H:%M:%S"
            ),

            "type": transaction["transaction_type"],

            "amount": float(
                transaction["amount"]
            ),

            "balance": float(
                transaction["balance_after"]
            ),

            "related_account":
                transaction["related_account"]
        })

    return {
        "account_number": account.account_number,
        "first_name": account.first_name,
        "last_name": account.last_name,
        "age": account.age,
        "phone": account.phone,
        "address": account.address,
        "balance": float(account.balance),
        "history": history
    }


# =========================
# GET ALL ACCOUNTS
# =========================

@app.get("/accounts")
def get_accounts():

    accounts = bank.view_all_accounts()

    return [
        get_public_account(account)
        for account in accounts
    ]


# =========================
# GET SINGLE ACCOUNT
# =========================

@app.get("/accounts/{account_number}")
def get_account(account_number: int):

    account = bank.search_account(
        account_number
    )

    if account is None:

        return {
            "success": False,
            "message": "Account not found"
        }

    return {
        "success": True,
        "account": get_public_account(account)
    }


# =========================
# CREATE ACCOUNT
# =========================

@app.post("/accounts")
def create_account(
    account_data: AccountCreate
):

    new_account = bank.create_account(
        account_data.first_name,
        account_data.last_name,
        account_data.age,
        account_data.phone,
        account_data.address,
        account_data.pin,
        account_data.balance
    )

    return {
        "success": True,
        "message": "Account created successfully",
        "account": get_public_account(new_account)
    }


# =========================
# DELETE ACCOUNT
# =========================

@app.delete("/accounts/{account_number}")
def delete_account(account_number: int):

    deleted_account = bank.delete_account(
        account_number
    )

    if deleted_account is None:

        return {
            "success": False,
            "message": "Account not found"
        }

    return {
        "success": True,
        "message": "Account deleted successfully",
        "account": get_public_account(
            deleted_account
        )
    }


# =========================
# ADMIN LOGIN
# =========================

@app.post("/auth/admin/login")
def admin_login(
    login_data: AdminLogin
):

    admin_user = auth.admin_login(
        login_data.username,
        login_data.password
    )

    if admin_user is None:

        return {
            "success": False,
            "message": "Invalid username or password"
        }

    return {
        "success": True,
        "message": "Admin login successful",
        "admin_id": admin_user.admin_id,
        "username": admin_user.username
    }


# =========================
# CUSTOMER LOGIN
# =========================

@app.post("/auth/customer/login")
def customer_login(
    login_data: CustomerLogin
):

    account = auth.customer_login(
        login_data.account_number,
        login_data.pin
    )

    if account is None:

        return {
            "success": False,
            "message": "Invalid account number or PIN"
        }

    return {
        "success": True,
        "message": "Customer login successful",
        "account": get_public_account(account)
    }


# =========================
# CHECK BALANCE
# =========================

@app.get("/accounts/{account_number}/balance")
def check_balance(
    account_number: int
):

    account = bank.search_account(
        account_number
    )

    if account is None:

        return {
            "success": False,
            "message": "Account not found"
        }

    return {
        "success": True,
        "account_number": account.account_number,
        "balance": float(
            account.check_balance()
        )
    }


# =========================
# DEPOSIT
# =========================

@app.post("/accounts/{account_number}/deposit")
def deposit(
    account_number: int,
    request: AmountRequest
):

    account = bank.search_account(
        account_number
    )

    if account is None:

        return {
            "success": False,
            "message": "Account not found"
        }

    success = db_deposit(
        account_number,
        request.amount
    )

    if not success:

        return {
            "success": False,
            "message": "Invalid deposit amount"
        }

    updated_account = bank.search_account(
        account_number
    )

    return {
        "success": True,
        "message": "Amount deposited successfully",
        "account_number": account_number,
        "amount": request.amount,
        "balance": float(
            updated_account.balance
        )
    }


# =========================
# WITHDRAW
# =========================

@app.post("/accounts/{account_number}/withdraw")
def withdraw(
    account_number: int,
    request: AmountRequest
):

    account = bank.search_account(
        account_number
    )

    if account is None:

        return {
            "success": False,
            "message": "Account not found"
        }

    success = db_withdraw(
        account_number,
        request.amount
    )

    if not success:

        return {
            "success": False,
            "message":
                "Withdrawal failed. "
                "Check amount or available balance."
        }

    updated_account = bank.search_account(
        account_number
    )

    return {
        "success": True,
        "message": "Amount withdrawn successfully",
        "account_number": account_number,
        "amount": request.amount,
        "balance": float(
            updated_account.balance
        )
    }


# =========================
# TRANSFER
# =========================

@app.post("/accounts/{account_number}/transfer")
def transfer(
    account_number: int,
    request: TransferRequest
):

    sender = bank.search_account(
        account_number
    )

    if sender is None:

        return {
            "success": False,
            "message": "Sender account not found"
        }

    receiver = bank.search_account(
        request.receiver_account_number
    )

    if receiver is None:

        return {
            "success": False,
            "message": "Receiver account not found"
        }

    success = db_transfer(
        account_number,
        request.receiver_account_number,
        request.amount
    )

    if not success:

        return {
            "success": False,
            "message":
                "Transfer failed. "
                "Check amount or balance."
        }

    updated_sender = bank.search_account(
        account_number
    )

    updated_receiver = bank.search_account(
        request.receiver_account_number
    )

    return {
        "success": True,
        "message": "Transfer successful",

        "sender_account":
            updated_sender.account_number,

        "receiver_account":
            updated_receiver.account_number,

        "amount":
            request.amount,

        "sender_balance":
            float(updated_sender.balance),

        "receiver_balance":
            float(updated_receiver.balance)
    }


# =========================
# CHANGE PIN
# =========================

@app.put("/accounts/{account_number}/pin")
def change_pin(
    account_number: int,
    request: ChangePinRequest
):

    account = bank.search_account(
        account_number
    )

    if account is None:

        return {
            "success": False,
            "message": "Account not found"
        }

    # Verify current PIN
    if not account.verify_pin(
        request.current_pin
    ):

        return {
            "success": False,
            "message":
                "Invalid current PIN or new PIN"
        }

    # Validate new PIN
    if len(str(request.new_pin)) != 4:

        return {
            "success": False,
            "message":
                "Invalid current PIN or new PIN"
        }

    # Hash new PIN
    new_pin_hash = hashlib.sha256(
        str(request.new_pin).encode()
    ).hexdigest()

    success = update_pin(
        account_number,
        new_pin_hash
    )

    if not success:

        return {
            "success": False,
            "message":
                "Invalid current PIN or new PIN"
        }

    return {
        "success": True,
        "message": "PIN changed successfully"
    }