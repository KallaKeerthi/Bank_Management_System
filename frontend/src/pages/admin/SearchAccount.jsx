import { useState } from "react";
import { Link } from "react-router-dom";

import { getAccount } from "../../services/accountService";

function SearchAccount() {
    const [accountNumber, setAccountNumber] = useState("");
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSearch(event) {
        event.preventDefault();

        setAccount(null);
        setError("");

        if (!accountNumber) {
            setError("Please enter an account number.");
            return;
        }

        setLoading(true);

        const result = await getAccount(accountNumber);

        setLoading(false);

        if (!result.success) {
            setError(result.message || "Account not found.");
            return;
        }

        setAccount(result.account);
    }

    return (
        <div className="search-account-page">

            <div className="search-account-container">

                <div className="search-account-header">
                    <div>
                        <h1>Search Account</h1>
                        <p>
                            Search for a customer using their
                            account number.
                        </p>
                    </div>
                    
                </div>


                <form
                    onSubmit={handleSearch}
                    className="account-search-form"
                >
                    <label>
                        Account Number
                    </label>

                    <div className="search-input-row">
                        <input
                            type="number"
                            value={accountNumber}
                            onChange={(event) =>
                                setAccountNumber(event.target.value)
                            }
                            placeholder="Enter account number"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </form>


                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}


                {account && (
                    <div className="account-details">

                        <h2>Account Details</h2>

                        <div className="details-grid">

                            <div>
                                <span>Account Number</span>
                                <strong>
                                    {account.account_number}
                                </strong>
                            </div>

                            <div>
                                <span>First Name</span>
                                <strong>
                                    {account.first_name}
                                </strong>
                            </div>

                            <div>
                                <span>Last Name</span>
                                <strong>
                                    {account.last_name}
                                </strong>
                            </div>

                            <div>
                                <span>Age</span>
                                <strong>
                                    {account.age}
                                </strong>
                            </div>

                            <div>
                                <span>Phone</span>
                                <strong>
                                    {account.phone}
                                </strong>
                            </div>

                            <div>
                                <span>Balance</span>
                                <strong>
                                    ₹
                                    {Number(
                                        account.balance
                                    ).toLocaleString("en-IN")}
                                </strong>
                            </div>

                            <div className="address-field">
                                <span>Address</span>
                                <strong>
                                    {account.address}
                                </strong>
                            </div>

                        </div>

                        <p className="security-note">
                            PIN information is hidden for security.
                        </p>

                    </div>
                )}

            </div>

        </div>
    );
}

export default SearchAccount;