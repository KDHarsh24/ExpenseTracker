const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db("expenseTracker");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const getDB = () => {
    if (!db) {
        throw new Error("Database not initialized");
    }
    return db;
};

module.exports = { connectDB, getDB };
