import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function History() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const account = user?.account;

    if (!account) {
        return (
            <div className="history-page">
                <div className="history-container">
                    <h2>Account information not available.</h2>
                </div>
            </div>
        );
    }

    const history = account.history || [];

    return (
        <div className="history-page">

            <div className="history-container">

                <div className="history-header">

                    <div>
                        <h1>Transaction History</h1>

                        <p>
                            Account #{account.account_number}
                        </p>
                    </div>

                </div>

                {history.length === 0 ? (

                    <div className="empty-history">

                        <h2>No Transactions</h2>

                        <p>
                            You haven't made any transactions yet.
                        </p>

                    </div>

                ) : (

                    <div className="history-table-container">

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

                                {history
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
                                                ).toLocaleString("en-IN")}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    transaction.balance
                                                ).toLocaleString("en-IN")}
                                            </td>

                                        </tr>

                                    ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default History;