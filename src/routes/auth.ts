import express from "express";
const router = express.Router();

// controllers
import { AuthController } from "../controllers/AuthController";

// user service
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";

// create user repository
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

// create instance of auth controller and pass user service as dependency
const auth = new AuthController(userService);

router.post("/register", (req, res) => auth.register(req, res));

export default router;
