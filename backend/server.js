require("dotenv").config();  // Load environment variables

const express = require("express");
const { connectDB } = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

connectDB();
const app = express();

app.use(
    cors({
      origin: "https://expensetracker-wine-rho.vercel.app", // Frontend URL
      credentials: true, // Allow cookies/auth headers
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
      allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    })
  );
  
  // Handle preflight requests properly
  app.options("*", cors());
  
  // Middleware
  app.use(express.json());
  
  // Sample route
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/", console.log('hello'));
app.listen(5000, () => console.log("Server running on port 5000"));
