import { Request, Response } from "express";

export class AuthController {
  async register(req: Request, res: Response) {
    res.status(201).json({ message: "Register" });
  }
}
