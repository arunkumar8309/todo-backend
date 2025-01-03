const app = require("./app");
const connectDB = require("./dbConnection/db");
const { PORT } = require("./config/config");
const logger = require("./services/logger");

// Initialize database connection
connectDB()
  .then(() => {
    logger.info("Database connection established successfully.");

    // Start the server only after DB connection is successful
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`Failed to connect to the database: ${error.message}`);
    process.exit(1); // Exit the application if the DB connection fails
  });

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Promise Rejection: ${reason}`);
  process.exit(1);
});
