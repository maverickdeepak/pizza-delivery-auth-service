import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  defaultMeta: { service: "auth-service" },
  transports: [
    new winston.transports.File({
      filename: "logs/app.log",
      level: "error",
      silent: false,
    }),
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json(),
        winston.format.colorize(),
      ),
    }),
  ],
});

export default logger;
