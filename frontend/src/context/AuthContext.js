import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { login, register } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await axios.get("https://expensetrackerbackend-pied.vercel.app/api/auth/me", { withCredentials: true });
                setUser(data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogin = async (credentials) => {
        try {
            const { data } = await login(credentials);
            setUser(data.user);
            return true;
        } catch (error) {
            return false;
        }
    };

    const handleRegister = async (credentials) => {
        try {
            await register(credentials);
            return true;
        } catch (error) {
            return false;
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("https://expensetrackerbackend-pied.vercel.app/api/auth/logout", {}, { withCredentials: true });
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleRegister, handleLogout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
