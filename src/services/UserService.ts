import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password, role }: UserData) {
    const userExist = await this.userRepository.findOne({ where: { email } });

    if (userExist) {
      const error = createHttpError(409, "User already exists.");
      throw error;
    }

    // hash the password
    const saltRoundes = 10;
    const hashedPassword = await bcrypt.hash(password, saltRoundes);

    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });
    } catch (err) {
      const error = createHttpError(500, "Failed to create user");
      throw error || err;
    }
  }

  async checkUserExist(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    // check if user exist
    if (!user) {
      const error = createHttpError(401, "Invalid credentials");
      throw error;
    }

    try {
      // check the user password
      const decryptPassword = await bcrypt.compare(password, user.password);
      if (!decryptPassword) {
        const error = createHttpError(401, "Invalid credentials.");
        throw error;
      }
      return user;
    } catch (err) {
      const error = createHttpError(500, "Invalid credentials.");
      throw error || err;
    }
  }
}
