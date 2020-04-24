import JWT from "jsonwebtoken";
import { Users, Sequelize } from "../models/models";
const Op = Sequelize.Op;
/**
 * @description Signs a JWT token via UserID
 * @param  {Object} user
 * @param {Number} user.UserID
 * @returns {String} accessToken
 */
const signUserToken = user => {
  return JWT.sign(
    {
      iss: "loan-calculator", // issuer
      sub: user.UserID, // associate new user with this JWT token
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // Expire after current time + 1 day ahead
    },
    process.env.JWT_SECRET
  );
};

export { signUserToken };
