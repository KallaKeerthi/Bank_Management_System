import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getAllAccounts,
    deleteAccount,
} from "../../services/accountService";

function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

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

    async function handleDelete(accountNumber) {
        const confirmed = window.confirm(
            `Are you sure you want to delete account ${accountNumber}?`
        );

        if (!confirmed) {
            return;
        }

        const result = await deleteAccount(accountNumber);

        if (!result.success) {
            setError(result.message);
            return;
        }

        // Remove deleted account from UI
        setAccounts((previous) =>
            previous.filter(
                (account) =>
                    account.account_number !== accountNumber
            )
        );
    }

    const filteredAccounts = accounts.filter((account) => {
        const searchValue = search.toLowerCase();

        const fullName =
            `${account.first_name} ${account.last_name}`.toLowerCase();

        return (
            String(account.account_number).includes(searchValue) ||
            fullName.includes(searchValue) ||
            String(account.phone).includes(searchValue)
        );
    });

    return (
        <div className="accounts-page">

            <div className="accounts-header">

                <div>
                    <h1>All Accounts</h1>

                    <p>
                        View and manage all bank accounts.
                    </p>
                </div>

                <div className="accounts-actions">

                    <button onClick={loadAccounts}>
                        Refresh
                    </button>

                    <Link to="/admin/create-account">
                        Create Account
                    </Link>

                </div>

            </div>


            <div className="search-box">

                <input
                    type="text"
                    placeholder="Search by account number, name or phone..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />

            </div>


            {loading && (
                <p>Loading accounts...</p>
            )}


            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {!loading && !error && (
                <div className="accounts-table-container">

                    {filteredAccounts.length === 0 ? (

                        <p className="empty-message">
                            No accounts found.
                        </p>

                    ) : (

                        <table>

                            <thead>

                                <tr>
                                    <th>Account Number</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Phone</th>
                                    <th>Balance</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredAccounts.map(
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
                                                {account.age}
                                            </td>

                                            <td>
                                                {account.phone}
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

                                                <div className="table-actions">

                                                    <Link
                                                        to={`/admin/accounts/${account.account_number}`}
                                                    >
                                                        View
                                                    </Link>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                account.account_number
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    )}

                </div>
            )}

        </div>
    );
}

export default Accounts;