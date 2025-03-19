import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchExpenses } from "../services/api";
import ExpenseList from "../components/ExpenseList";
import ExpenseForm from "../components/ExpenseForm";
import InsightsChart from "../components/InsightsChart";
import { useNavigate } from "react-router-dom";


function Dashboard() {
    const { user, handleLogout } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const navigate = useNavigate();

    // Fetch expenses
    const loadExpenses = async () => {
        try {
            const { data } = await fetchExpenses();
            setExpenses(data);
        } catch (error) {
            alert("Error fetching expenses");
        }
    };

    useEffect(() => {
        loadExpenses();
    }, []);

    // Logout function
    const logout = () => {
        handleLogout();
        navigate("/"); // Redirect to login after logout
    };
    console.log(user);
    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-brand">Expense Tracker</div>
                <div className="navbar-links">
                    <span>Welcome, {user?.firstName || "Guest"}</span>
                    <button className="logout-button" onClick={logout}>Logout</button>
                </div>
            </nav>

            {/* Main Dashboard */}
            <div className="dashboard-content">
                <ExpenseForm onExpenseAdded={loadExpenses} />
                    <div className="dashboard-card">
                        <h3>Spending Insights</h3>
                        <InsightsChart expenses={expenses} />
                    </div>
                    <div className="dashboard-card">
                        <h3>Expense List</h3>
                        <ExpenseList expenses={expenses} onExpenseUpdated={loadExpenses} />
                    </div>
            </div>
        </div>
    );
}

export default Dashboard;
