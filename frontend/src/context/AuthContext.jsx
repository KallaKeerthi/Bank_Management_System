import {
    createContext,
    useContext,
    useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        const storedUser =
            localStorage.getItem("bankUser");

        if (!storedUser) {
            return null;
        }

        try {
            return JSON.parse(storedUser);
        } catch (error) {

            localStorage.removeItem("bankUser");

            return null;
        }
    });


    const login = (userData) => {

        localStorage.setItem(
            "bankUser",
            JSON.stringify(userData)
        );

        setUser(userData);
    };


    const logout = () => {

        localStorage.removeItem("bankUser");

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(AuthContext);

}