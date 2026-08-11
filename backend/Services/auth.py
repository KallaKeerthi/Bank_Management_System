"""

AUTHENTICATION Attributes:

Attributes
----------

ADMIN OBJ
BANK OBJ

BANK Methods

Methods
-------

admin_login()
customer_login()

"""

class Authentication:
    def __init__(self, admin, bank):
        self.admin = admin
        self.bank = bank
        
    def admin_login(self, username, password):
        
        if self.admin.username == username and self.admin.verify_password(password):
            return self.admin
        else:
            return None
            
    
    def customer_login(self, account_number, pin_number):
        
        account = self.bank.search_account(account_number)
        
        if account:
            if account.verify_pin(pin_number):
                return account
        return None