import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { changePin } from "../../services/accountService";
import { useAuth } from "../../context/AuthContext";

function ChangePin() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const account = user?.account;

    const [currentPin, setCurrentPin] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (!account) {
        return <p>Account information not available.</p>;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!/^\d{4}$/.test(currentPin)) {
            setError("Current PIN must contain exactly 4 digits.");
            return;
        }

        if (!/^\d{4}$/.test(newPin)) {
            setError("New PIN must contain exactly 4 digits.");
            return;
        }

        if (newPin !== confirmPin) {
            setError("New PIN and confirm PIN do not match.");
            return;
        }

        if (currentPin === newPin) {
            setError("New PIN must be different from the current PIN.");
            return;
        }

        setLoading(true);

        const result = await changePin(
            account.account_number,
            currentPin,
            newPin
        );

        setLoading(false);

        if (!result.success) {
            setError(result.message || "PIN could not be changed.");
            return;
        }

        setSuccess("PIN changed successfully.");

        setCurrentPin("");
        setNewPin("");
        setConfirmPin("");
    }

    return (
        <div className="transaction-page">

            <div className="transaction-container">

                <div className="transaction-header">

                    <div>
                        <h1>Change PIN</h1>

                        <p>
                            Update your 4-digit account PIN.
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
                    <span>Account Number</span>

                    <strong>
                        {account.account_number}
                    </strong>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="transaction-form"
                >

                    <label>
                        Current PIN
                    </label>

                    <input
                        type="password"
                        inputMode="numeric"
                        maxLength="4"
                        value={currentPin}
                        onChange={(event) =>
                            setCurrentPin(event.target.value)
                        }
                        placeholder="Enter current PIN"
                        required
                    />

                    <label>
                        New PIN
                    </label>

                    <input
                        type="password"
                        inputMode="numeric"
                        maxLength="4"
                        value={newPin}
                        onChange={(event) =>
                            setNewPin(event.target.value)
                        }
                        placeholder="Enter new PIN"
                        required
                    />

                    <label>
                        Confirm New PIN
                    </label>

                    <input
                        type="password"
                        inputMode="numeric"
                        maxLength="4"
                        value={confirmPin}
                        onChange={(event) =>
                            setConfirmPin(event.target.value)
                        }
                        placeholder="Confirm new PIN"
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
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Changing PIN..."
                            : "Change PIN"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default ChangePin;