import api from "./api";

export async function getAllAccounts() {
    try {
        const response = await api.get("/accounts");

        return {
            success: true,
            accounts: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
}

export async function getAccount(accountNumber) {
    try {
        const response = await api.get(
            `/accounts/${accountNumber}`
        );

        return response.data;
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
}

export async function createAccount(accountData) {
    try {
        const response = await api.post("/accounts", {
            first_name: accountData.first_name,
            last_name: accountData.last_name,
            age: Number(accountData.age),
            phone: accountData.phone,
            address: accountData.address,
            pin: String(accountData.pin),
            balance: Number(accountData.balance),
        });

        return response.data;
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
}

export async function deleteAccount(accountNumber) {
    try {
        const response = await api.delete(
            `/accounts/${accountNumber}`
        );

        return response.data;
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
}

export async function getBalance(accountNumber) {
    try {
        const response = await api.get(
            `/accounts/${accountNumber}/balance`
        );

        return response.data;
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
}

export async function changePin(
    accountNumber,
    currentPin,
    newPin
) {
    try {
        const response = await api.put(
            `/accounts/${accountNumber}/pin`,
            {
                current_pin: String(currentPin),
                new_pin: String(newPin),
            }
        );

        return response.data;
    } catch (error) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
}

function getErrorMessage(error) {
    if (error.response) {
        return (
            error.response.data?.message ||
            error.response.data?.detail ||
            "Something went wrong."
        );
    }

    return "Unable to connect to the server.";
}