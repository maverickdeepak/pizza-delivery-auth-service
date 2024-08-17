import fs from "fs";
import path from "path";
import { NextFunction, Response } from "express";
import { JwtPayload, sign } from "jsonwebtoken";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { Role } from "../constants";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
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

      // read the PEM file and store that file as private key
      let privateKey: Buffer;
      try {
        privateKey = fs.readFileSync(
          path.join(__dirname, "../../certs/private.pem"),
        );
      } catch (error) {
        const err =
          createHttpError(500, "Error while reading private keys.") || error;
        return next(err);
      }
      const payload: JwtPayload = {
        id: user.id,
        role: user.role,
      };
      const accessToken = sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "1d",
        issuer: "auth-service",
      });
      const refreshToken = "refreshToken=";

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({ id: user.id, role: user.role });
    } catch (error) {
      next(error);
      return;
    }
  }
}
