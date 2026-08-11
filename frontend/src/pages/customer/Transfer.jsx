import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { transfer } from "../../services/transactionService";
import { useAuth } from "../../context/AuthContext";

function Transfer() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const account = user?.account;

    const [receiverAccount, setReceiverAccount] = useState("");
    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [newBalance, setNewBalance] = useState(null);

    if (!account) {
        return <p>Account information not available.</p>;
    }

    async function handleTransfer(event) {
        event.preventDefault();

        setError("");
        setSuccess("");
        setNewBalance(null);

        const receiver = Number(receiverAccount);
        const transferAmount = Number(amount);

        if (!receiverAccount) {
            setError("Please enter the receiver account number.");
            return;
        }

        if (receiver === Number(account.account_number)) {
            setError("You cannot transfer money to your own account.");
            return;
        }

        if (transferAmount <= 0) {
            setError("Enter a valid transfer amount.");
            return;
        }

        if (transferAmount > Number(account.balance)) {
            setError("Insufficient balance.");
            return;
        }

        setLoading(true);

        const result = await transfer(
            account.account_number,
            receiver,
            transferAmount
        );

        setLoading(false);

        if (!result.success) {
            setError(result.message || "Transfer failed.");
            return;
        }

        setSuccess(result.message);

        setNewBalance(result.sender_balance);

        // Update sender balance in React
        login({
            ...user,
            account: {
                ...user.account,
                balance: result.sender_balance,
            },
        });

        setReceiverAccount("");
        setAmount("");
    }

    return (
        <div className="transaction-page">

            <div className="transaction-container">

                <div className="transaction-header">

                    <div>
                        <h1>Transfer Money</h1>

                        <p>
                            Transfer money to another bank account.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/customer/dashboard")
                        }
                    >
                        Dashboard
                    </button>

                </div>


                <div className="current-balance">

                    <span>Available Balance</span>

                    <strong>
                        ₹
                        {Number(
                            account.balance
                        ).toLocaleString("en-IN")}
                    </strong>

                </div>


                <form
                    onSubmit={handleTransfer}
                    className="transaction-form"
                >

                    <label>
                        Receiver Account Number
                    </label>

                    <input
                        type="number"
                        value={receiverAccount}
                        onChange={(event) =>
                            setReceiverAccount(
                                event.target.value
                            )
                        }
                        placeholder="Enter receiver account number"
                        required
                    />


                    <label>
                        Transfer Amount
                    </label>

                    <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={amount}
                        onChange={(event) =>
                            setAmount(event.target.value)
                        }
                        placeholder="Enter amount"
                        required
                    />


                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="form-success">

                            {success}

                            {newBalance !== null && (
                                <div>
                                    New Balance: ₹
                                    {Number(
                                        newBalance
                                    ).toLocaleString("en-IN")}
                                </div>
                            )}

                        </div>
                    )}


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : "Transfer Money"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Transfer;