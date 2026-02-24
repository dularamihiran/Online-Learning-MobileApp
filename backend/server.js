const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config(); 

const connectDB = require("./config/db");
connectDB();

const app = express();

// Track server start time
const startTime = Date.now();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const uptime = process.uptime();
  const currentTime = new Date().toISOString();
  
  // Check database connection
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  
  const healthCheck = {
    status: "ok",
    timestamp: currentTime,
    uptime: `${Math.floor(uptime / 60)} minutes ${Math.floor(uptime % 60)} seconds`,
    uptimeSeconds: Math.floor(uptime),
    service: "Learnova API",
    version: "1.0.0",
    database: {
      status: dbStatus,
      type: "MongoDB"
    },
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`
    },
    environment: process.env.NODE_ENV || "development"
  };
  
  // Return 503 if database is disconnected
  if (dbStatus === "disconnected") {
    healthCheck.status = "error";
    return res.status(503).json(healthCheck);
  }
  
  res.status(200).json(healthCheck);
});

app.use("/api/auth", require("./routes/authRoutes")); 


app.use("/api/courses", require("./routes/courseRoutes"));

app.use("/api/enrollments", require("./routes/enrollmentRoutes"));

app.use("/api/gpt", require("./routes/gptRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
