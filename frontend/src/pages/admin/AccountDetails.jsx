import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAccount } from "../../services/accountService";

function AccountDetails() {
    const { accountNumber } = useParams();
    const navigate = useNavigate();

    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAccount() {
            setLoading(true);
            setError("");

            const result = await getAccount(accountNumber);

            if (!result.success) {
                setError(result.message || "Account not found.");
                setLoading(false);
                return;
            }

            setAccount(result.account);
            setLoading(false);
        }

        loadAccount();
    }, [accountNumber]);

    if (loading) {
        return (
            <div className="account-details-page">
                <h2>Loading account...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="account-details-page">
                <h2>Unable to load account</h2>
                <p>{error}</p>

                <button
                    onClick={() => navigate("/admin/accounts")}
                >
                    Back to Accounts
                </button>
            </div>
        );
    }

    return (
        <div className="account-details-page">

            <div className="account-details-header">

                <div>
                    <h1>Account Details</h1>

                    <p>
                        Account #{account.account_number}
                    </p>
                </div>

                <button
                    onClick={() => navigate("/admin/accounts")}
                >
                    Back to Accounts
                </button>

            </div>


            <div className="account-details-card">

                <h2>Personal Information</h2>

                <div className="details-grid">

                    <div className="detail-item">
                        <span>Account Number</span>
                        <strong>
                            {account.account_number}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>First Name</span>
                        <strong>
                            {account.first_name}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Last Name</span>
                        <strong>
                            {account.last_name}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Age</span>
                        <strong>
                            {account.age}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Phone</span>
                        <strong>
                            {account.phone}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span>Address</span>
                        <strong>
                            {account.address}
                        </strong>
                    </div>

                </div>

            </div>


            <div className="account-details-card">

                <h2>Account Information</h2>

                <div className="balance-box">

                    <span>Current Balance</span>

                    <strong>
                        ₹
                        {Number(account.balance).toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                </div>

            </div>


            <div className="account-details-card">

                <h2>Transaction History</h2>

                {account.history &&
                account.history.length > 0 ? (

                    <div className="details-history">

                        <table>

                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Transaction</th>
                                    <th>Amount</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>

                            <tbody>

                                {account.history
                                    .slice()
                                    .reverse()
                                    .map((transaction, index) => (

                                        <tr key={index}>

                                            <td>
                                                {transaction.date}
                                            </td>

                                            <td>
                                                {transaction.type}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    transaction.amount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    transaction.balance
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                        </tr>

                                    ))}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <p className="no-history">
                        No transactions found.
                    </p>

                )}

            </div>

        </div>
    );
}

export default AccountDetails;