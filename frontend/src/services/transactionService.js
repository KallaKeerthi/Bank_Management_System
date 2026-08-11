import api from "./api";

function getErrorMessage(error) {
    if (error.response) {
        return (
            error.response.data?.message ||
            error.response.data?.detail ||
            "Transaction failed."
        );
    }

    return "Unable to connect to the server.";
}

export async function deposit(accountNumber, amount) {
    try {
        const response = await api.post(
            `/accounts/${accountNumber}/deposit`,
            {
                amount: Number(amount),
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

export async function withdraw(accountNumber, amount) {
    try {
        const response = await api.post(
            `/accounts/${accountNumber}/withdraw`,
            {
                amount: Number(amount),
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

export async function transfer(
    senderAccountNumber,
    receiverAccountNumber,
    amount
) {
    try {
        const response = await api.post(
            `/accounts/${senderAccountNumber}/transfer`,
            {
                receiver_account_number:
                    Number(receiverAccountNumber),

                amount: Number(amount),
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