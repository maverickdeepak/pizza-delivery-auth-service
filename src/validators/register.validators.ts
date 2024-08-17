import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    notEmpty: true,
    errorMessage: "Email is required field",
    trim: true,
  },
  firstName: {
    notEmpty: true,
    errorMessage: "First Name is required field",
    trim: true,
  },
  lastName: {
    notEmpty: true,
    errorMessage: "Last Name is required field",
    trim: true,
  },
  password: {
    notEmpty: true,
    errorMessage: "Password is required field",
  },
});
