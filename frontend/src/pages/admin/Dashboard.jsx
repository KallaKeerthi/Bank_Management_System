import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllAccounts } from "../../services/accountService";

function AdminDashboard() {

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadAccounts() {

        setLoading(true);
        setError("");

        const result = await getAllAccounts();

        if (result.success) {
            setAccounts(result.accounts);
        } else {
            setError(result.message);
        }

        setLoading(false);
    }

    useEffect(() => {
        loadAccounts();
    }, []);

    const totalBalance = accounts.reduce(
        (total, account) =>
            total + Number(account.balance || 0),
        0
    );

    return (
        <div className="dashboard">

            {/* Header */}

            <div className="dashboard-header">

                <div>
                    <h1>Admin Dashboard</h1>

                    <p>
                        Manage bank accounts and monitor
                        banking activity.
                    </p>
                </div>

                <div className="dashboard-actions">

                    <button onClick={loadAccounts}>
                        Refresh
                    </button>

                    <Link to="/admin/create-account">
                        Create Account
                    </Link>

                </div>

            </div>


            {/* Loading */}

            {loading && (
                <p>Loading accounts...</p>
            )}


            {/* Error */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {!loading && !error && (
                <>

                    {/* Statistics */}

                    <div className="stats">

                        <div className="stat-card">

                            <h3>Total Accounts</h3>

                            <p>
                                {accounts.length}
                            </p>

                        </div>


                        <div className="stat-card">

                            <h3>Total Bank Balance</h3>

                            <p>
                                ₹
                                {totalBalance.toLocaleString(
                                    "en-IN"
                                )}
                            </p>

                        </div>


                        <div className="stat-card">

                            <h3>Latest Account</h3>

                            <p>
                                {accounts.length > 0
                                    ? `#${accounts[
                                          accounts.length - 1
                                      ].account_number}`
                                    : "None"}
                            </p>

                        </div>

                    </div>


                    {/* Accounts */}

                    <div className="accounts-section">

                        <div className="section-header">

                            <h2>
                                Bank Accounts
                            </h2>

                            <Link to="/admin/accounts">
                                View All
                            </Link>

                        </div>


                        {accounts.length === 0 ? (

                            <p>
                                No accounts found.
                            </p>

                        ) : (

                            <div className="table-container">

                                <table>

                                    <thead>

                                        <tr>
                                            <th>
                                                Account Number
                                            </th>

                                            <th>
                                                Name
                                            </th>

                                            <th>
                                                Phone
                                            </th>

                                            <th>
                                                Balance
                                            </th>

                                            <th>
                                                Action
                                            </th>
                                        </tr>

                                    </thead>


                                    <tbody>

                                        {accounts
                                            .slice()
                                            .reverse()
                                            .slice(0, 5)
                                            .map(
                                                (account) => (
                                                    <tr
                                                        key={
                                                            account.account_number
                                                        }
                                                    >

                                                        <td>
                                                            {
                                                                account.account_number
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                account.first_name
                                                            }{" "}
                                                            {
                                                                account.last_name
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                account.phone
                                                            }
                                                        </td>

                                                        <td>
                                                            ₹
                                                            {Number(
                                                                account.balance
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </td>

                                                        <td>

                                                            <Link
                                                                to={`/admin/accounts/${account.account_number}`}
                                                            >
                                                                View
                                                            </Link>

                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </>
            )}

        </div>
    );
}

export default AdminDashboard;