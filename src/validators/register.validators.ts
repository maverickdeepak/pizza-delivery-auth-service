import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    notEmpty: true,
    errorMessage: "Email is required field",
  },
  firstName: {
    notEmpty: true,
    errorMessage: "First Name is required field",
  },
  password: {
    notEmpty: true,
    errorMessage: "Password is required field",
  },
});
