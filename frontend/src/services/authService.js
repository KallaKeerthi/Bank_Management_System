import api from "./api";

export async function adminLogin(username, password) {
    try {
        const response = await api.post("/auth/admin/login", {
            username,
            password,
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }

        return {
            success: false,
            message: "Unable to connect to the server.",
        };
    }
}

export async function customerLogin(accountNumber, pin) {
    try {
        const response = await api.post("/auth/customer/login", {
            account_number: Number(accountNumber),
            pin: String(pin),
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }

        return {
            success: false,
            message: "Unable to connect to the server.",
        };
    }
}