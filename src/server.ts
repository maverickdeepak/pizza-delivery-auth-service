import app from "./app";
import { Config } from "./config";
import logger from "./config/logger";

const PORT = Config.PORT;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) logger.error(error.message);
    process.exit(1);
  }
};

startServer();
