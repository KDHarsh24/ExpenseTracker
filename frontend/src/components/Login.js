import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate("/dashboard");
        } catch (error) {
            alert("Invalid Credentials");
        }
    };

    return (
        <div className="auth-container">
            <div className="login-card">
                <h1 className="auth-title">Expense Tracker</h1>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Login</button>
                </form>
                <p className="auth-text">
                    Don't have an account?{" "}
                    <span className="auth-link" onClick={() => navigate("/register")}>
                        Register Now
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;
