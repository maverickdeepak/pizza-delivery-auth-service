import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    notEmpty: true,
    errorMessage: "Email is required field.",
    trim: true,
  },
  password: {
    notEmpty: true,
    errorMessage: "Password is required field.",
    trim: true,
  },
});
