import express from "express";
import { Users } from "../models/models";
let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (CRUD)
 */

router
  .route("/me")

  /**
   * @swagger
   *
   * /me:
   *  get:
   *    description: Create a new user
   *    tags: [Users]
   *    responses:
   *      '200':
   *        description: Successfully returned sign-in User's properties
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  example: success
   *                data:
   *                  type: object
   *                  $ref: '#/components/schemas/Users'
   *      '401':
   *        description: Authorization token was invalid or missing
   *      '500':
   *         description: An unexpected error occured
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FiveHundredError'
   */
  .get(async (req, res) => {
    try {
      // Find basic information for logged-in user.
      let user = await Users.findOne({ where: { UserID: req.user.UserID } });

      // If user does not exist. However, they should always exist in this scenerio.
      if (!user) {
        res.status(404).json({
          status: "error",
          data: null,
          error: "User does not exist or has been deleted."
        });
      }

      // Return basic user information
      res.status(200).json({
        status: "success",
        data: user.toJSON()
      });
    } catch (err) {
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  })

  /**
   * @swagger
   *
   * /me:
   *  put:
   *    description: Update user information
   *    tags: [Users]
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
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
   *        description: Successfully updated user's properties
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  example: success
   *                data:
   *                  type: object
   *                  $ref: '#/components/schemas/Users'
   *      '401':
   *        description: Authorization token was invalid or missing
   *      '409':
   *        description: Email is already taken
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
  .put(async (req, res) => {
    try {
      let { FirstName, LastName, Email } = req.body;

      // Only Update user information that is present in Request Body
      await Users.update(
        {
          ...(FirstName && { FirstName }),
          ...(LastName && { LastName }),
          ...(Email && { Email })
        },
        {
          where: {
            UserID: req.user.UserID
          }
        }
      );

      // Get newly updated user
      let user = await Users.findOne({ where: { UserID: req.user.UserID } });

      // Return user information
      res.status(200).json({ status: "success", data: user.toJSON() });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  });

router.route("/password-reset").post((req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
  }
});

export default router;
