import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getAccount } from "../../services/accountService";

function CustomerDashboard() {

    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [account, setAccount] = useState(user?.account || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadLatestAccount() {

            if (!user?.account?.account_number) {
                setLoading(false);
                return;
            }

            const result = await getAccount(
                user.account.account_number
            );

            if (result.success) {

                setAccount(result.account);

                // Update AuthContext/localStorage
                login({
                    ...user,
                    account: result.account
                });

            }

            setLoading(false);
        }

        loadLatestAccount();

    }, []);

    if (loading) {
        return (
            <div className="dashboard">
                <h2>Loading account...</h2>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="dashboard">
                <h2>Customer information not available.</h2>

                <button onClick={() => navigate("/login")}>
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="customer-dashboard">

            {/* Header */}

            <header className="customer-header">

                <div>

                    <h1>
                        Welcome, {account.first_name}!
                    </h1>

                    <p>
                        Manage your bank account and
                        transactions.
                    </p>

                </div>

            </header>


            {/* Account Summary */}

            <section className="customer-summary">

                <div className="customer-card">

                    <span>
                        Account Number
                    </span>

                    <strong>
                        {account.account_number}
                    </strong>

                </div>


                <div className="customer-card balance-card">

                    <span>
                        Available Balance
                    </span>

                    <strong>
                        ₹
                        {Number(
                            account.balance || 0
                        ).toLocaleString("en-IN")}
                    </strong>

                </div>

            </section>


            {/* Quick Actions */}

            <section className="quick-actions">

                <h2>Quick Actions</h2>

                <div className="action-grid">

                    <Link to="/customer/deposit">

                        <strong>
                            Deposit
                        </strong>

                        <span>
                            Add money to your account
                        </span>

                    </Link>


                    <Link to="/customer/withdraw">

                        <strong>
                            Withdraw
                        </strong>

                        <span>
                            Withdraw money
                        </span>

                    </Link>


                    <Link to="/customer/transfer">

                        <strong>
                            Transfer
                        </strong>

                        <span>
                            Transfer money to another account
                        </span>

                    </Link>


                    <Link to="/customer/change-pin">

                        <strong>
                            Change PIN
                        </strong>

                        <span>
                            Update your account PIN
                        </span>

                    </Link>

                </div>

            </section>


            {/* Recent Transactions */}

            <section className="recent-transactions">

                <div className="section-header">

                    <h2>
                        Recent Transactions
                    </h2>

                    <Link to="/customer/history">
                        View History
                    </Link>

                </div>


                {account.history &&
                account.history.length > 0 ? (

                    <div className="transaction-list">

                        {account.history
                            .slice()
                            .reverse()
                            .slice(0, 5)
                            .map(
                                (transaction, index) => (

                                    <div
                                        key={index}
                                        className="transaction-item"
                                    >

                                        <div>

                                            <span>
                                                {transaction.type}
                                            </span>

                                            <small>
                                                {transaction.date}
                                            </small>

                                        </div>

                                        <strong>
                                            ₹
                                            {Number(
                                                transaction.amount || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>

                                )
                            )}

                    </div>

                ) : (

                    <div className="empty-transactions">
                        No transactions yet.
                    </div>

                )}

            </section>

        </div>
    );
}

export default CustomerDashboard;