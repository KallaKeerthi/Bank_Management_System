"""
acc = Account(10001, "Keerthi", "Kalla", 21, 9849144752, "B. Kothuru, Pithapuram Mandala, Kakinada, AP, India",2004, 1000)
print(acc.display_details())

a = Admin(101, "admin", "admin1")
print(a.display_admin())

b = Bank("SBI", "HYD", "kukatpally", "jiujeh5b88y", {})
print(b.bank_details())

"""

from models.admin import Admin
from models.bank import Bank
from Services.auth import Authentication

def admin_dashboard(auth, b):
    is_admin_logged = auth.admin_login()
    if is_admin_logged:
        print("ADMIN LOGIN Successful")
        while True:
            print("===========================\nADMIN DASHBOARD\n===========================\n1. Create Account\n2. Search Account\n3. View All Accounts\n4. Delete Account\n5. Logout")
            num = int(input("Enter Your Choice: "))
            if num==1:
                first_name = input("Enter first name: ")
                last_name = input("Enter last name: ")
                age = int(input("Enter Age: "))
                phone = input("Enter Phone Number: ")
                address = input("Enter Address: ")
                pin = int(input("Enter PIN: "))
                balance = int(input("Enter Balance: "))

                if len(str(pin)) == 4:
                    new_account = b.create_account(first_name, last_name, age, phone, address, pin, balance)
                    print("\n\n")
                    print("Account Created Successfully🥳\n\n")
                    print(new_account.display_details())
                else:
                    print("PIN length must be exactly 4 digits")
    
            elif num == 2:
                account_number = int(input("Enter Account Number: "))
                account = b.search_account(account_number)
                if account:
                    print("\nAccount found successfully\n")
                    print(account.display_details())
                else:
                    print("\nNo such account found\n")
        
            elif num == 3:
                if b.view_all_accounts():
                    for acc in b.view_all_accounts():
                        print("\n\n")
                        print(acc.display_details())
                        print("\n\n")
                else:
                    print("No accounts available")
        
            elif num == 4:
                account_number = int(input("Enter Account Number: "))
                account = b.delete_account(account_number)
                if account is not None:
                    print("\nAccount deleted successfully\n")
                    print(account.display_details())
                else:
                    print("\nNo such account found\n")
        
            elif num == 5:
                print("\nLogged out successfully\n")
                break
    
            else:
                print("\nInvalid Choice\n")
        
    else:
        print("\nInvalid username or password\n")
        
        
def customer_dashboard(auth, b):
    is_customer_logged = auth.customer_login()
    if is_customer_logged:
        print("CUSTOMER LOGIN Successful")
        while True:
            print("===========================\nCUSTOMER DASHBOARD\n===========================\n1. Deposit\n2. Withdraw\n3. Check Balance\n4. Transfer\n5. Change PIN\n6. View Transaction History\n7. Logout")
            num = int(input("Enter Your Choice: "))
            if num==1:
                amount = int(input("Enter amount to deposit: "))
                deposited = is_customer_logged.deposit(amount)
                if deposited:
                    b.save_accounts()
                    print(f"\nAmount deposited successfully\nCurrent balance: {is_customer_logged.check_balance()}\n")
                else:
                    print("\nInvalid Amount\n")
            
            elif num==2:
                amount = int(input("Enter amount to withdraw: "))
                withdrawn = is_customer_logged.withdraw(amount)
                if withdrawn:
                    b.save_accounts()
                    print(f"\nAmount withdrawn successfully\nCurrent balance: {is_customer_logged.check_balance()}\n")
                else:
                    print("\nInsufficient Balance\n")
            
            elif num==3:
                print(f"\nThe current balance is {is_customer_logged.check_balance()}\n")
                
            elif num==4:
                account_number = int(input("Enter receiver account number: "))
                receiver = b.search_account(account_number)
                if receiver:
                    amount = int(input("Enter amount to transfer: "))
                    print()
                    print(f"Before Transaction the Sender balance: {is_customer_logged.check_balance()}")
                    print(f"Before Transaction the Receiver balance: {receiver.check_balance()}")
                    print()
                    transferred = is_customer_logged.transfer(receiver, amount)
                    if transferred:
                        b.save_accounts()
                        print()
                        print(f"After Transaction the Sender balance: {is_customer_logged.check_balance()}")
                        print(f"After Transaction the Receiver balance: {receiver.check_balance()}\n")
                        print("\nTransfer Successful..\n")
                    else: 
                        print("\nTransfer Unsuccessful..\n")
                else:
                    print("\nNo such account found!!\n")
                
            elif num==5:
                curr_pin = int(input("Enter Current PIN: "))
                new_pin = int(input("Enter New PIN: "))
                if len(str(new_pin)) == 4:
                    changed_pin = is_customer_logged.change_pin(curr_pin, new_pin)
                    if changed_pin:
                        b.save_accounts()
                        print("\nPIN changed successfully🥳\n")
                    else: 
                        print("\nPIN failed to change\n")
                else:
                    print("New PIN length must be exactly 4 digits")
        
            elif num == 6:
                is_customer_logged.view_transaction_history()
        
            elif num==7:
                print("\nLogged out successfully!!!\n")
                break
            
            else: 
                print("\nInvalid Choice..\n")
                
    else:
        print("\nInvalid username or password\n")


def main():
    a = Admin(101, "admin", "admin1")
    b = Bank("SBI", "HYD", "kukatpally", "jiujeh5b88y")
    b.load_accounts()
    auth = Authentication(a, b)
    print("WELCOME TO BANK MANAGEMENT SYSTEM")
    while True:
        print("\nPRESS BELOW OPTIONS:\n1. Admin Login\n2. Customer Login\n3.EXIT")
        number = int(input("Enter Any Above Options: "))

        if number == 1:
            admin_dashboard(auth, b)   

        elif number == 2:
            customer_dashboard(auth, b)
            
        elif number == 3:
            print("\nExit\n")
            break
    
        else:
            print("\nInvalid Choice\n")
            
if __name__ == "__main__":
    main()