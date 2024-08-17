import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;
    this.logger.debug(`Registering user: ${email}`);
    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });
      this.logger.info(`User created: ${user.id}`);
      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
      return;
    }
  }
}
