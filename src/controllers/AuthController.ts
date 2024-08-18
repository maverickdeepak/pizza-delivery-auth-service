import { NextFunction, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { Role } from "../constants";
import { validationResult } from "express-validator";

import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import { TokenService } from "../services/TokenService";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
  ) {}

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

      // save the refresh token to DB
      const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
      const newRefreshToken = await refreshTokenRepo.save({
        user: user,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // will expire in 30 days
      });

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
}
