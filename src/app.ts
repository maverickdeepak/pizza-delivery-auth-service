import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import authRouter from "./routes/auth";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// auth Router
app.use("/auth", authRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        message: err.message,
        status: statusCode,
      },
    ],
  });
});

export default app;
