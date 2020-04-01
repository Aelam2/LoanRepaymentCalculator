import { body } from "express-validator";

const createPayment = () => {
  return [
    // username must be an email
    body("username").isEmail(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 5 })
  ];
};

export { createPayment };
