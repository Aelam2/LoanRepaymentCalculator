import { body } from "express-validator";

const userSignUpRules = () => {
  return [
    // username must be an emai
    body("UserName", "Username must start with a letter and not contain special characters").matches(/^[A-Za-z][A-Za-z0-9-]+$/i),
    // body("Password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,"i"),
    body("Password", "Password must include atleast 8 characters.").isLength({ min: 8 }),
    body("Email").isEmail()
  ];
};

export { userSignUpRules };
