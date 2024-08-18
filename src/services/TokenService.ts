import fs from "fs";
import path from "path";
import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { Config } from "../config";
import { User } from "../entity/User";
import { RefreshToken } from "../entity/RefreshToken";
import { Repository } from "typeorm";

export class TokenService {
  constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

  // This method generates an access token using the RS256 algorithm
  // It reads the private key from a PEM file and signs the payload with it
  // The access token expires in 1 day and is issued by the 'auth-service'
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

  // This method generates a refresh token using the HS256 algorithm
  // It signs the payload with a secret key from the Config module
  // The refresh token expires in 30 days, is issued by 'auth-service',
  // and includes the user ID as the JWT ID
  generateRefreshToken(payload: JwtPayload) {
    const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
      algorithm: "HS256",
      expiresIn: "30d",
      issuer: "auth-service",
      jwtid: payload.id.toString(),
    });

    return refreshToken;
  }

  // This method persists the refresh token in the database
  // It creates a new RefreshToken entity with the user and expiration date
  // The refresh token will expire in 30 days from the current date
  async persistRefreshToken(user: User) {
    const newRefreshToken = await this.refreshTokenRepository.save({
      user: user,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // will expire in 30 days
    });

    return newRefreshToken;
  }
}
