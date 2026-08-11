import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { withdraw } from "../../services/transactionService";
import { useAuth } from "../../context/AuthContext";

function Withdraw() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const account = user?.account;

    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [newBalance, setNewBalance] = useState(null);

    if (!account) {
        return <p>Account information not available.</p>;
    }

    async function handleWithdraw(event) {
        event.preventDefault();

        setError("");
        setSuccess("");
        setNewBalance(null);

        const withdrawalAmount = Number(amount);

        if (withdrawalAmount <= 0) {
            setError("Enter a valid withdrawal amount.");
            return;
        }

        if (withdrawalAmount > Number(account.balance)) {
            setError("Insufficient balance.");
            return;
        }

        setLoading(true);

        const result = await withdraw(
            account.account_number,
            withdrawalAmount
        );

        setLoading(false);

        if (!result.success) {
            setError(result.message || "Withdrawal failed.");
            return;
        }

        setSuccess(result.message);
        setNewBalance(result.balance);

        // Update balance in React
        login({
            ...user,
            account: {
                ...user.account,
                balance: result.balance,
            },
        });

        setAmount("");
    }

    return (
        <div className="transaction-page">

            <div className="transaction-container">

                <div className="transaction-header">

                    <div>
                        <h1>Withdraw Money</h1>

                        <p>
                            Withdraw money from your bank account.
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
                    onSubmit={handleWithdraw}
                    className="transaction-form"
                >

                    <label>
                        Withdrawal Amount
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
                            : "Withdraw Money"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Withdraw;