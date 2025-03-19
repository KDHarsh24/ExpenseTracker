require("dotenv").config();  // Load environment variables

const express = require("express");
const { connectDB } = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

connectDB();
const app = express();

app.use(cors({
    origin: 'https://expensetracker-wine-rho.vercel.app',
    credentials: true, // Required for cookies or authentication headers
  }));
  
  // OR, to allow multiple origins dynamically:
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://expensetracker-wine-rho.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
