import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { deposit } from "../../services/transactionService";
import { useAuth } from "../../context/AuthContext";

function Deposit() {
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

    async function handleDeposit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        const depositAmount = Number(amount);

        if (depositAmount <= 0) {
            setError("Enter a valid deposit amount.");
            return;
        }

        setLoading(true);

        const result = await deposit(
            account.account_number,
            depositAmount
        );

        setLoading(false);

        if (!result.success) {
            setError(result.message || "Deposit failed.");
            return;
        }

        setSuccess(result.message);
        setNewBalance(result.balance);

        // Update React's logged-in customer data
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
                        <h1>Deposit Money</h1>

                        <p>
                            Add money to your bank account.
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

                    <span>Current Balance</span>

                    <strong>
                        ₹
                        {Number(
                            account.balance
                        ).toLocaleString("en-IN")}
                    </strong>

                </div>


                <form
                    onSubmit={handleDeposit}
                    className="transaction-form"
                >

                    <label>
                        Deposit Amount
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
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
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
                            : "Deposit Money"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Deposit;