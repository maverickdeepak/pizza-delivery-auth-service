import { Request } from "express";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterUserRequest extends Request {
  body: UserData;
}
