import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";

const PORT = Config.PORT;

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("💫 Database connected successfully");
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) logger.error(error.message);
    process.exit(1);
  }
};

startServer();
