import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return null;
    }

    function handleLogout() {
        logout();
        navigate("/login");
    }

    const isAdmin = user.role === "admin";
    const isCustomer = user.role === "customer";

    return (
        <nav className="navbar">

            <div className="navbar-brand">
                🏦 Bank Management
            </div>

            <div className="navbar-links">

                {isAdmin && (
                    <>
                        <Link to="/admin/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/admin/accounts">
                            Accounts
                        </Link>

                        <Link to="/admin/create-account">
                            Create Account
                        </Link>

                        <Link to="/admin/search">
                            Search
                        </Link>
                    </>
                )}

                {isCustomer && (
                    <>
                        <Link to="/customer/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/customer/deposit">
                            Deposit
                        </Link>

                        <Link to="/customer/withdraw">
                            Withdraw
                        </Link>

                        <Link to="/customer/transfer">
                            Transfer
                        </Link>

                        <Link to="/customer/history">
                            History
                        </Link>

                        <Link to="/customer/change-pin">
                            Change PIN
                        </Link>
                    </>
                )}

            </div>

            <div className="navbar-user">

                <span>
                    {isAdmin
                        ? `Admin: ${user.username}`
                        : `Account: ${user.account?.account_number}`}
                </span>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;