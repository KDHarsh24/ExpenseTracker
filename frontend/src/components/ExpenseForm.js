import { useState } from "react";
import { addExpense } from "../services/api";

function ExpenseForm({ onExpenseAdded }) {
    const [form, setForm] = useState({ amount: "", category: "", date: "", description: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addExpense(form);
            setForm({ amount: "", category: "", date: "", description: "" });
            onExpenseAdded();
        } catch (error) {
            alert("Error adding expense");
        }
    };

    return (
        <div className="expense-form-container">
            <h3 className="expense-form-title">➕ Add New Expense</h3>
            <form onSubmit={handleSubmit} className="expense-form">
                <div className="input-group">
                    <input type="number" name="amount" placeholder="Amount (₹)" value={form.amount} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="category" placeholder="Category (e.g. Food, Travel)" value={form.category} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="date" name="date" value={form.date} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <input type="text" name="description" placeholder="Description (Optional)" value={form.description} onChange={handleChange} />
                </div>
                <button type="submit" className="expense-submit-button">Add Expense</button>
            </form>
        </div>
    );
}

export default ExpenseForm;
