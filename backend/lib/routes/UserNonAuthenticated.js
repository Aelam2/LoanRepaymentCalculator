import express from "express";
import passport from "passport";
import moment from "moment";
import logger from "../logging";
import { v1 } from "uuid";
import nodemailer from "nodemailer";
import validate, { userSignUpRules } from "../middleware/route-validator";
import { Users, UserPasswordResets, Sequelize } from "../models/models";
import { signUserToken } from "../helpers/userHelper";
import { isUnique, handleSequelizeError } from "../helpers/errorHelper";
let router = express.Router();
let Op = Sequelize.Op;

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
  let { UserName, Password, FirstName, LastName, Email } = req.body;

  try {
    // Check if UserName or Email already exists in database
    await isUnique(Users, "UserName", UserName);
    await isUnique(Users, "Email", Email);

    // Create new User, Errors are handled in catch block
    const newUser = await Users.create({ CreationMethod: "local", UserName, Password, FirstName, LastName, Email });

    // Sign JWT Token
    const token = signUserToken(newUser);

    // Response with Token
    logger.info("User Sign Up Success", { UserName, FirstName, LastName, Email });
    res.status(200).json({ token });
  } catch (error) {
    logger.error(`User Sign Up Failed with exception ${err.message}`, { UserName, FirstName, LastName, Email });

    let sequelizeError = handleSequelizeError(error);
    if (sequelizeError.status) {
      res.status(sequelizeError.status).json({ ...sequelizeError, status: "error" });
    } else {
      res.status(500).json({ status: "error", data: null, error: "An unexpected error occurred" });
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

      logger.info("User Google Sign In Success", { ...user });
      res.status(200).json({ token });
    } catch (err) {
      logger.error(`User Google Sign In Failed with exception ${err.message}`, { ...user });

      let sequelizeError = handleSequelizeError(err);
      if (sequelizeError.status) {
        res.status(sequelizeError.status).json({ ...sequelizeError, status: "error" });
      } else {
        res.status(500).json({ status: "error", data: null, error: "An unexpected error occurred" });
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

      logger.info("User Facebook Sign In Success", { ...user });
      res.status(200).json({ token });
    } catch (err) {
      logger.error(`User Facebook Sign In Failed with exception ${err.message}`, { ...user });

      let sequelizeError = handleSequelizeError(err);
      if (sequelizeError.status) {
        res.status(sequelizeError.status).json({ ...sequelizeError, status: "error" });
      } else {
        res.status(500).json({ status: "error", data: null, error: "An unexpected error occurred" });
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

    logger.info("User Local Sign In Success", { ...req.user.toJSON() });
    res.status(200).json({ token });
  } catch (err) {
    logger.error(`User Local Sign In Failed with exception ${err.message}`, { ...req.user.toJSON() });
    res.status(500).json({ status: "error", data: null, error: "An unexpected error occurred" });
  }
});

router.route("/password-reset").post(async (req, res) => {
  let { Email } = req.body;

  try {
    // Find user associated to email requesting password reset
    let user = await Users.findOne({
      where: { Email }
    });

    // If there is no user associated to the email
    if (!user) {
      res.status(404).json({ status: "not-found", data: null, error: "Email is not associated to any accounts." });
    }

    // If the user was created via social OAuth
    // There password needs to be reset on that platform
    if (user.CreationMethod != "local") {
      res.status(403).json({ status: "forbidden", data: null, error: "Account was created via Google/Facebook and is unable to be reset." });
    }

    let token = v1();

    // Create unique token that is sent to the user.
    // They have one to reset their password via the token
    await UserPasswordResets.create({
      Email,
      ResetToken: token,
      IsUsed: false,
      DateExpires: moment().add(1, "hour").toISOString()
    });

    // Token is used a url param and must be visited with in hour of request
    // https://www.repayment.dev/user/password-reset/${token}
    let smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SITE_EMAIL,
        pass: process.env.SITE_EMAIL_PASSWORD
      }
    });

    let mailOptions = {
      to: user.Email,
      from: "no-reply@repayment.dev",
      subject: "Repayment.dev Password Reset",
      text:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        `https://www.repayment.dev/user/password-reset/${token}` +
        "\n\n" +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n"
    };

    await smtpTransport.sendMail(mailOptions);

    logger.info("Send Password Reset Email Success", { Email });
    res.status(200).json({ status: "success", data: `Password reset email was successfully sent to ${user.Email}.` });
  } catch (err) {
    logger.error(`Send Password Reset Email Failed with exception ${err.message}`, { Email });
    res.status(500).json({ status: "error", data: null, error: "An unexpected error occurred." });
  }
});

router.route("/password-reset/:token").get(async (req, res) => {
  let { token } = req.params;

  try {
    let resetAttempt = await UserPasswordResets.findOne({
      where: {
        ResetToken: token,
        IsUsed: false,
        DateExpires: { [Op.gt]: moment() }
      }
    });

    if (!resetAttempt) {
      logger.info("Get Password Reset Token Warning: Token Expired", { token });
      res.status(404).json({ status: "not-found", data: null, error: "Password reset link has expired. Please request a new email." });
    }

    logger.info("Get Password Reset Token Success", { token });
    res.status(200).json({ status: "success", data: resetAttempt });
  } catch (err) {
    logger.error(`Get Password Reset Token Failed with exception ${err.message}`, { token });
    res.status(500).json({ status: "error", data: null, error: "An unexpected error occurred." });
  }
});

router.route("/password-reset/:token").post(async (req, res) => {
  let { token } = req.params;
  let { Email, Password } = req.body;

  try {
    let resetAttempt = await UserPasswordResets.findOne({
      where: {
        Email,
        ResetToken: token,
        IsUsed: false,
        DateExpires: { [Op.gt]: moment() }
      }
    });

    if (!resetAttempt) {
      logger.warning("Complete Password Reset Warning: Token has expired", { token, Email });
      res.status(404).json({ status: "not-found", data: null, error: "Password reset link has expired. Please request a new email." });
    }

    let [update] = await Users.update(
      {
        Password
      },
      {
        where: { Email }
      }
    );

    if (update) {
      resetAttempt.IsUsed = true;
      resetAttempt.save();
    }

    logger.info("Complete Password Reset Success", { token, Email });
    res.status(200).json({ status: "success", data: `Passwor was successfully reset for ${Email}` });
  } catch (err) {
    logger.error(`Complete Password Reset Failed with exception ${err.message}`, { token, Email });
    res.status(500).json({ status: "error", data: null, error: "An unexpected error occurred." });
  }
});

export default router;
