import express, { NextFunction, Request, Response } from "express";
const router = express.Router();

// controllers
import { AuthController } from "../controllers/AuthController";

// user service
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidators from "../validators/register.validators";

// create user repository
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

// create instance of auth controller and pass user service as dependency
const auth = new AuthController(userService, logger);

router.post(
  "/register",
  registerValidators,
  (req: Request, res: Response, next: NextFunction) =>
    auth.register(req, res, next),
);

export default router;
