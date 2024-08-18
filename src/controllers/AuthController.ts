import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { Role } from "../constants";
import { validationResult } from "express-validator";

import { TokenService } from "../services/TokenService";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
  ) {}

  // register a new user
  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    // validate the req
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { firstName, lastName, email, password } = req.body;
    this.logger.debug(`Registering user: ${email}`);

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role: Role.CUSTOMER,
      });
      this.logger.info(`User created: ${user.id}`);

      const payload: JwtPayload = {
        id: user.id,
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        jwtid: newRefreshToken.id,
      });

      // set access token to cookie
      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // set refresh token to cookie
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({ id: user.id, role: user.role });
    } catch (error) {
      next(error);
      return;
    }
  }

  // login user
  async login(req: Request, res: Response, next: NextFunction) {
    // validate the req in express-validator
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body;
    this.logger.debug(`Logging in user: ${email}`);

    try {
      const validateUser = await this.userService.checkUserExist(
        email,
        password,
      );

      const payload: JwtPayload = {
        id: validateUser.id,
        role: validateUser.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      // add token to cookie
      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.status(200).json({ id: validateUser.id, role: validateUser.role });
    } catch (error) {
      next(error);
      return;
    }
  }
}
