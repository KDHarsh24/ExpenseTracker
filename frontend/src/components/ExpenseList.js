import { useState } from "react";
import { updateExpense, deleteExpense } from "../services/api";

function ExpenseList({ expenses, onExpenseUpdated }) {
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({ amount: "", category: "", date: "", description: "" });

    const handleEdit = (expense) => {
        setEditId(expense._id);
        setEditForm({ amount: expense.amount, category: expense.category, date: expense.date.split("T")[0], description: expense.description });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await updateExpense(editId, editForm);
            setEditId(null);
            onExpenseUpdated();
        } catch (error) {
            alert("Error updating expense");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await deleteExpense(id);
                onExpenseUpdated();
            } catch (error) {
                alert("Error deleting expense");
            }
        }
    };

    return (
        <div className="expense-list-container">
            <h3>Expenses</h3>
            <ul className="expense-list">
                {expenses.map((expense) => (
                    <li key={expense._id} className="expense-item">
                        {editId === expense._id ? (
                            <>
                                <input type="number" name="amount" value={editForm.amount} onChange={handleEditChange} required />
                                <input type="text" name="category" value={editForm.category} onChange={handleEditChange} required />
                                <input type="date" name="date" value={editForm.date} onChange={handleEditChange} required />
                                <input type="text" name="description" value={editForm.description} onChange={handleEditChange} />
                                <button onClick={handleUpdate} className="save-button">Save</button>
                                <button onClick={() => setEditId(null)} className="cancel-button">Cancel</button>
                            </>
                        ) : (
                            <>
                                <span>{expense.category} - ₹{expense.amount} on {new Date(expense.date).toLocaleDateString()}</span>
                                <button onClick={() => handleEdit(expense)} className="edit-button">Edit</button>
                                <button onClick={() => handleDelete(expense._id)} className="delete-button">Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ExpenseList;
