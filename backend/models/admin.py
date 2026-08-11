"""
ADMIN Attributes: 

Attributes
----------
admin_id
username
password

ADMIN Methods:

Methods
-------
login()
logout()

"""

class Admin:
    def __init__(self, admin_id, username, password):
        self.admin_id = admin_id
        self.username = username
        self.__password = password
        
    def verify_password(self, password):
        return self.__password == password
        
    def display_admin(self):
        return f"Admin Details:\nAdmin ID: {self.admin_id}\nUser Name: {self.username}"