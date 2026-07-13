"""

ACCOUNT Attributes:

Attributes
----------
account_number
first_name
last_name
age
phone
address
pin
balance

ACCOUNT Methods:

Methods
-------
deposit()
withdraw()
transfer()
check_balance()
display_details()
change_pin()

"""

from datetime import datetime
import hashlib

class Account:
    def __init__(self, account_number, first_name, last_name, age, phone, address, pin, balance, history = None):
        self.account_number = account_number
        self.first_name = first_name
        self.last_name = last_name
        self.age = age
        self.phone = phone
        self.address = address
        self.__pin = hashlib.sha256(str(pin).encode()).hexdigest()
        self.balance = balance
        if history is None:
            self.history = []
        else:
            self.history = history 
        
    def to_dict(self):
        return {
            "account_number": self.account_number,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "age": self.age,
            "phone": self.phone,
            "address": self.address,
            "pin": self._Account__pin,
            "balance": self.balance,
            "history": self.history
        }
        
    def add_transaction(self, transaction_type, amount):
        self.history.append({
            "date": datetime.now().strftime("%d-%m-%Y %H:%M:%S"),
            "type": transaction_type,
            "amount": amount,
            "balance": self.balance
        })
    
    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            self.add_transaction("Deposit", amount)
            return True
        return False
    
    def withdraw(self, amount):
        if self.balance >= amount and amount > 0:
            self.balance -= amount
            self.add_transaction("Withdraw", amount)
            return True
        return False
    
    
    def transfer(self, receiver, amount):
        if amount > 0 and self.account_number != receiver.account_number:
            if self.withdraw(amount):
                self.history.append({
                    "date": datetime.now().strftime("%d-%m-%Y %H:%M:%S"),
                    "type": f"Transfer to {receiver.account_number}",
                    "amount": amount,
                    "balance": self.balance
                })

                receiver.deposit(amount)

                receiver.history.append({
                    "date": datetime.now().strftime("%d-%m-%Y %H:%M:%S"),
                    "type": f"Received from {self.account_number}",
                    "amount": amount,
                    "balance": receiver.balance
                })

                return True
        return False
    
    def view_transaction_history(self):
        if not self.history:
            print("No transactions found.")
            return
        print("\n===== TRANSACTION HISTORY =====")
        for transaction in self.history:
            print("--------------------------------")
            print("Date    :", transaction["date"])
            print("Type    :", transaction["type"])
            print("Amount  :", transaction["amount"])
            print("Balance :", transaction["balance"])
    
    def check_balance(self):
        return self.balance
    
    def display_details(self):
        return f"Customer Details:\nAccount Number: {self.account_number}\nName: {self.first_name} {self.last_name}\nAge: {self.age}\nPhone Number: {self.phone}\nAddress: {self.address}\nBalance: {self.balance}"
        
    def set_pin(self, new_pin):
        if len(str(new_pin)) == 4:
            self.__pin = hashlib.sha256(str(new_pin).encode()).hexdigest()
            return True
        return False
            
    def change_pin(self,curr_pin, new_pin):
        if self.verify_pin(curr_pin):
            return self.set_pin(new_pin)
        else:
            return False
    
    def verify_pin(self, pin):
        return self.__pin == hashlib.sha256(str(pin).encode()).hexdigest()