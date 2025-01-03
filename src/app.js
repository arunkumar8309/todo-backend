const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const taskRoutes = require("./routes/taskRoutes");
const logger = require("./services/logger");
const app = express();

// Enable CORS for all routes
app.use(cors());
// Middleware setup
app.use(bodyParser.json());

// Log incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Error handling middleware (to catch errors and handle them)
app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`);
  res.status(500).send("Something went wrong!");
});
// API routes
app.use("/api/tasks", taskRoutes);

module.exports = app;
