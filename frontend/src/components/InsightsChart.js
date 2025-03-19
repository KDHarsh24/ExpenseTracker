import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function InsightsChart({ expenses }) {
    if (!expenses || expenses.length === 0) {
        return <p className="no-data-message">No expense data available.</p>;
    }

    // Convert `amount` to a number while aggregating category totals
    const categoryTotals = expenses.reduce((acc, expense) => {
        const amount = Number(expense.amount); // Convert string to number
        if (!isNaN(amount)) {
            acc[expense.category] = (acc[expense.category] || 0) + amount;
        }
        return acc;
    }, {});

    const data = Object.keys(categoryTotals).map((category) => ({
        name: category,
        value: categoryTotals[category],
    }));

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#F39C12"];

    return (
        <div className="insights-container">
            <h3 className="insights-title">📊 Spending Insights</h3>
            <PieChart width={350} height={350}>
                <Pie 
                    data={data} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={50} 
                    outerRadius={100} 
                    fill="#8884d8" 
                    dataKey="value"
                    label
                >
                    {data.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
}

export default InsightsChart;
