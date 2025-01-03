const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const colors = require("colors");

// Define colors for each log level (for console output)
colors.setTheme({
  info: ["bgGreen", "black"], // Green background with black text for info logs
  error: ["bgRed", "white"], // Red background with white text for error logs
  warn: ["bgYellow", "black"], // Yellow background with black text for warning logs
  debug: ["bgBlue", "white"], // Blue background with white text for debug logs
});

// Set the logs directory path
const logsDirectory = path.join(__dirname, "../../logs");

// Console format (with colors)
const consoleFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf((info) => {
    let message = `${info.timestamp} [${info.level.toUpperCase()}]: ${
      info.message
    }`;
    // Apply color based on log level
    if (info.level === "info") message = colors.info(message);
    else if (info.level === "error") message = colors.error(message);
    else if (info.level === "warn") message = colors.warn(message);
    else if (info.level === "debug") message = colors.debug(message);
    return message;
  })
);

// File format (without colors)
const fileFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(
    (info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
  )
);

const logger = createLogger({
  level: "info",
  transports: [
    // Console transport with colors
    new transports.Console({
      format: consoleFormat,
    }),
    // File transport without colors
    new DailyRotateFile({
      filename: "app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      dirname: logsDirectory,
      maxSize: "20m",
      maxFiles: "14d",
      format: fileFormat, // Non-colored format for file
    }),
  ],
});

module.exports = logger;
