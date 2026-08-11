import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    adminLogin,
    customerLogin,
} from "../services/authService";

import { useAuth } from "../context/AuthContext";

function Login() {

    const [role, setRole] = useState("admin");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [accountNumber, setAccountNumber] = useState("");
    const [pin, setPin] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setLoading(true);

        let result;

        if (role === "admin") {

            result = await adminLogin(
                username,
                password
            );

            if (result.success) {

                login({
                    role: "admin",
                    admin_id: result.admin_id,
                    username: result.username,
                });

                navigate("/admin/dashboard");

            } else {
                setError(result.message);
            }

        } else {

            result = await customerLogin(
                accountNumber,
                pin
            );

            if (result.success) {

                login({
                    role: "customer",
                    account: result.account,
                });

                navigate("/customer/dashboard");

            } else {
                setError(result.message);
            }
        }

        setLoading(false);
    }

    return (
        <div className="login-page">

            <div className="login-card">

                <h1>Bank Management System</h1>

                <p>Login to your account</p>

                <div className="role-buttons">

                    <button
                        type="button"
                        className={
                            role === "admin"
                                ? "active"
                                : ""
                        }
                        onClick={() => {
                            setRole("admin");
                            setError("");
                        }}
                    >
                        Admin
                    </button>

                    <button
                        type="button"
                        className={
                            role === "customer"
                                ? "active"
                                : ""
                        }
                        onClick={() => {
                            setRole("customer");
                            setError("");
                        }}
                    >
                        Customer
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    {role === "admin" ? (
                        <>
                            <label>Username</label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                required
                            />

                            <label>Password</label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </>
                    ) : (
                        <>
                            <label>Account Number</label>

                            <input
                                type="number"
                                value={accountNumber}
                                onChange={(e) =>
                                    setAccountNumber(
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <label>PIN</label>

                            <input
                                type="password"
                                maxLength="4"
                                value={pin}
                                onChange={(e) =>
                                    setPin(e.target.value)
                                }
                                required
                            />
                        </>
                    )}

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;