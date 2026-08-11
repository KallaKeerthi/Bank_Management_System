import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./pages/Login";

import AdminDashboard from "./pages/admin/Dashboard";
import CreateAccount from "./pages/admin/CreateAccount";
import Accounts from "./pages/admin/Accounts";
import SearchAccount from "./pages/admin/SearchAccount";
import AccountDetails from "./pages/admin/AccountDetails";

import CustomerDashboard from "./pages/customer/Dashboard";
import Deposit from "./pages/customer/Deposit";
import Withdraw from "./pages/customer/Withdraw";
import Transfer from "./pages/customer/Transfer";
import ChangePin from "./pages/customer/ChangePin";
import History from "./pages/customer/History";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>

                {/* =========================
                    PUBLIC
                ========================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =========================
                    ADMIN
                ========================= */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/create-account"
                    element={
                        <ProtectedRoute role="admin">
                            <CreateAccount />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/accounts"
                    element={
                        <ProtectedRoute role="admin">
                            <Accounts />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/search"
                    element={
                        <ProtectedRoute role="admin">
                            <SearchAccount />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/accounts/:accountNumber"
                    element={
                        <ProtectedRoute role="admin">
                            <AccountDetails />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    CUSTOMER
                ========================= */}

                <Route
                    path="/customer/dashboard"
                    element={
                        <ProtectedRoute role="customer">
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/deposit"
                    element={
                        <ProtectedRoute role="customer">
                            <Deposit />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/withdraw"
                    element={
                        <ProtectedRoute role="customer">
                            <Withdraw />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/transfer"
                    element={
                        <ProtectedRoute role="customer">
                            <Transfer />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/change-pin"
                    element={
                        <ProtectedRoute role="customer">
                            <ChangePin />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer/history"
                    element={
                        <ProtectedRoute role="customer">
                            <History />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;