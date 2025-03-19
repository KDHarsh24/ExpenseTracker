const express = require("express");
const { connectDB } = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config(); // Load environment variables

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

connectDB();
const app = express();

// ✅ Correct order of middleware
app.use(cookieParser());
app.use(express.json());

// ✅ Enable CORS before defining routes
app.use(
  cors({
    origin: "https://expensetracker-wine-rho.vercel.app", // Frontend URL
    credentials: true, // Important for cookies/authentication
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests
app.options("*", cors());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// ❌ REMOVE app.use("/", console.log('hello'));
// This is invalid. Use:
app.get("/", (req, res) => {
  res.send("Hello, the server is running!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
