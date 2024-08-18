import fs from "fs";
import path from "path";
import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { Config } from "../config";

export class TokenService {
  generateAccessToken(payload: JwtPayload) {
    // read the PEM file and store that file as private key
    let privateKey: Buffer;
    try {
      privateKey = fs.readFileSync(
        path.join(__dirname, "../../certs/private.pem"),
      );
    } catch (error) {
      const err =
        createHttpError(500, "Error while reading private keys.") || error;
      throw err;
    }

    // generate access token
    const accessToken = sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1d",
      issuer: "auth-service",
    });

    return accessToken;
  }

  generateRefreshToken(payload: JwtPayload) {
    const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
      algorithm: "HS256",
      expiresIn: "30d",
      issuer: "auth-service",
      jwtid: payload.id.toString(),
    });

    return refreshToken;
  }
}
