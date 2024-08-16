import express from "express";
const router = express.Router();

// controllers
import { AuthController } from "../controllers/AuthController";

// create instance of auth controller
const auth = new AuthController();

router.post("/register", (req, res) => auth.register(req, res));

export default router;
