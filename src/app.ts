import "reflect-metadata";
import express, { Express, Request, Response, NextFunction } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import authRouter from "./routes/auth";

const app: Express = express();

app.get("/", (req, res) => {
    res.send("Welcome to Auth Service");
});

app.use("/auth", authRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode: number = err.statusCode || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                message: err.message,
                path: "",
                location: "",
            },
        ],
    });
});

export default app;
