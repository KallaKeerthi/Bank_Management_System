import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createAccount } from "../../services/accountService";

function CreateAccount() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        age: "",
        phone: "",
        address: "",
        pin: "",
        balance: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [createdAccount, setCreatedAccount] = useState(null);

    function handleChange(event) {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");
        setCreatedAccount(null);

        // Frontend validation

        if (form.pin.length !== 4 || !/^\d{4}$/.test(form.pin)) {
            setError("PIN must contain exactly 4 digits.");
            return;
        }

        if (Number(form.age) <= 0) {
            setError("Please enter a valid age.");
            return;
        }

        if (Number(form.balance) < 0) {
            setError("Initial balance cannot be negative.");
            return;
        }

        if (form.phone.length < 10) {
            setError("Please enter a valid phone number.");
            return;
        }

        setLoading(true);

        const result = await createAccount(form);

        setLoading(false);

        if (!result.success) {
            setError(result.message || "Account creation failed.");
            return;
        }

        setSuccess("Account created successfully!");

        setCreatedAccount(result.account);

        // Clear form
        setForm({
            first_name: "",
            last_name: "",
            age: "",
            phone: "",
            address: "",
            pin: "",
            balance: "",
        });
    }

    return (
        <div className="form-page">

            <div className="form-container">

                <div className="form-header">

                    <div>
                        <h1>Create Bank Account</h1>

                        <p>
                            Enter customer details to create
                            a new bank account.
                        </p>
                    </div>

                </div>


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


                {createdAccount && (
                    <div className="created-account">

                        <h2>Account Created</h2>

                        <p>
                            Account Number:
                            <strong>
                                {createdAccount.account_number}
                            </strong>
                        </p>

                        <p>
                            Customer:
                            <strong>
                                {createdAccount.first_name}{" "}
                                {createdAccount.last_name}
                            </strong>
                        </p>

                        <p>
                            Initial Balance:
                            <strong>
                                ₹
                                {Number(
                                    createdAccount.balance
                                ).toLocaleString("en-IN")}
                            </strong>
                        </p>

                        <p className="warning">
                            Keep the account number safe.
                            The PIN is not displayed for security.
                        </p>

                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                First Name
                            </label>

                            <input
                                name="first_name"
                                type="text"
                                value={form.first_name}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Last Name
                            </label>

                            <input
                                name="last_name"
                                type="text"
                                value={form.last_name}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Age
                            </label>

                            <input
                                name="age"
                                type="number"
                                min="1"
                                value={form.age}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Phone
                            </label>

                            <input
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group full-width">

                            <label>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                rows="3"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                PIN
                            </label>

                            <input
                                name="pin"
                                type="password"
                                inputMode="numeric"
                                maxLength="4"
                                value={form.pin}
                                onChange={handleChange}
                                required
                            />

                            <small>
                                PIN must be exactly 4 digits.
                            </small>

                        </div>


                        <div className="form-group">

                            <label>
                                Initial Balance
                            </label>

                            <input
                                name="balance"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.balance}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default CreateAccount;