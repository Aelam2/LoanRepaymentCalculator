import express from "express";
import passport from "passport";
import validate, { userSignUpRules } from "../middleware/route-validator";
import { Users } from "../models/models";
import { signUserToken } from "../helpers/userHelper";
import { isUnique, handleSequelizeError } from "../helpers/errorHelper";
let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (CRUD)
 */

/**
 * @swagger
 *
 * /sign-up:
 *  post:
 *    description: Create a new user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - UserName
 *              - Password
 *              - Email
 *            properties:
 *              UserName:
 *                type: string
 *                required: true
 *                description: User inputted value used for future logins
 *              Password:
 *                type: string
 *                format: password
 *                required: true
 *                description: Hashed user password, is required
 *              Email:
 *                type: string
 *                format: email
 *                description: Email for the user, needs to be unique.
 *              FirstName:
 *                type: string
 *                nullable: true
 *                description: User's First Name.
 *              LastName:
 *                type: string
 *                nullable: true
 *                description: User's Last Name.
 *    responses:
 *      '200':
 *        description: New user account was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: token used for logged-in requests
 *      '409':
 *        description: Email or Username has already been used
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/FourZeroNineError'
 *      '422':
 *        description: Invalid input for a field
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/FourTwentyTwoError'
 *      '500':
 *         description: An unexpected error occured
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FiveHundredError'
 */
router.route("/sign-up").post(userSignUpRules(), validate, async (req, res) => {
  try {
    let { UserName, Password, FirstName, LastName, Email } = req.body;

    // Check if UserName or Email already exists in database
    await isUnique(Users, "UserName", UserName);
    await isUnique(Users, "Email", Email);

    // Create new User, Errors are handled in catch block
    const newUser = await Users.create({ CreationMethod: "local", UserName, Password, FirstName, LastName, Email });

    // Sign JWT Token
    const token = signUserToken(newUser);

    // Response with Token
    res.status(200).json({ token });
  } catch (error) {
    let sequelizeError = handleSequelizeError(error);
    if (sequelizeError.status) {
      res.status(sequelizeError.status).json({ ...sequelizeError, status: "error" });
    } else {
      res.status(500).json({ status: "error", result: null, error: "An unexpected error occurred" });
    }
  }
});

/**
 * @swagger
 *
 * /oauth/google:
 *  post:
 *    description: Sign-In via Google+ OAuth
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - access_token
 *            properties:
 *              access_token:
 *                type: string
 *                required: true
 *                description: Access token from Google+
 *    responses:
 *      '200':
 *        description: Sign-in was successful and token was returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: token used for logged-in requests
 *      '500':
 *         description: An unexpected error occured
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FiveHundredError'
 */
router.route("/oauth/google").post((req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user, info) => {
    try {
      if (err) throw err;

      const token = signUserToken(user);

      res.status(200).json({ token });
    } catch (err) {
      let sequelizeError = handleSequelizeError(err);
      if (sequelizeError.status) {
        res.status(sequelizeError.status).json({ ...sequelizeError, status: "error" });
      } else {
        res.status(500).json({ status: "error", result: null, error: "An unexpected error occurred" });
      }
    }
  })(req, res, next);
});

/**
 * @swagger
 *
 * /oauth/facebook:
 *  post:
 *    description: Sign-In via Facebook OAuth
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - access_token
 *            properties:
 *              access_token:
 *                type: string
 *                required: true
 *                description: Access token from Facebook
 *    responses:
 *      '200':
 *        description: Sign-in was successful and token was returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: token used for logged-in requests
 *      '500':
 *         description: An unexpected error occured
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FiveHundredError'
 */
router.route("/oauth/facebook").post((req, res, next) => {
  passport.authenticate("facebook", { session: false }, async (err, user, info) => {
    try {
      if (err) throw err;

      const token = signUserToken(user);

      res.status(200).json({ token });
    } catch (err) {
      let sequelizeError = handleSequelizeError(err);
      if (sequelizeError.status) {
        res.status(sequelizeError.status).json({ ...sequelizeError, status: "error" });
      } else {
        res.status(500).json({ status: "error", result: null, error: "An unexpected error occurred" });
      }
    }
  })(req, res, next);
});

/**
 * @swagger
 *
 * /sign-in:
 *  post:
 *    description: Returns a JWT token that is required for logged-in routes.
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - UserName
 *              - Password
 *            properties:
 *              UserName:
 *                type: string
 *                required: true
 *                description: UserName attempting to login
 *              Password:
 *                type: string
 *                format: password
 *                required: true
 *                description: UserName's currently set password
 *    responses:
 *      '200':
 *        description: Sign-in was successful and token was returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: token used for logged-in requests
 *      '401':
 *        description: Username or Password incorrect
 *      '500':
 *         description: An unexpected error occured
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FiveHundredError'
 */
router.route("/sign-in").post(passport.authenticate("local", { session: false }), (req, res) => {
  try {
    const token = signUserToken(req.user.toJSON());

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ status: "error", result: null, error: "An unexpected error occurred" });
  }
});

export default router;
