import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

function Register() {
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            navigate("/");
        } catch (error) {
            alert("Registration failed!");
        }
    };

    return (
        <div className="auth-container">
            <div className="register-card">
                <h1 className="register-title">Expense Tracker</h1>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Register</button>
                </form>
                <p className="auth-text">
                    Already have an account?{" "}
                    <span className="auth-link" onClick={() => navigate("/")}>
                        Login Here
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Register;
