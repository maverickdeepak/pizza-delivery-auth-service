import express from "express";
import { AuthController } from "../controllers/AuthController";
const router = express.Router();

// create a new instance of class
const authController = new AuthController();

router.post("/register", (req, res) => authController.register(req, res));

export default router;
