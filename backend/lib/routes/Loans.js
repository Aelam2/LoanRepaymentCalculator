import express from "express";
import { Loans } from "../models/models";

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: User's Loans
 */

router
  .route("/loans")

  /**
   * @swagger
   *
   * /me/loans:
   *  get:
   *    description: Retrieve loans associated to a user
   *    tags: [Loans]
   *    responses:
   *      '200':
   *        description: Loans successfully returned
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
   *                  $ref: '#/components/schemas/Loans'
   *      '500':
   *         description: An unexpected error occured
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FiveHundredError'
   */
  .get(async (req, res) => {
    try {
      let { UserID } = req.user;

      let activeLoans = await Loans.findAll({
        where: { UserID }
      });

      res.status(200).json({ status: "success", data: activeLoans });
    } catch (err) {
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  })

  /**
   * @swagger
   *
   * /me/loans:
   *  post:
   *    description: Create a new loan associated to a user
   *    tags: [Loans]
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
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - LoanName
   *              - LoanType
   *              - LoanTerm
   *              - StartingPrinciple
   *              - InterestRate
   *              - PaymentMinimum
   *              - PaymentStart
   *            properties:
   *              LoanName:
   *                $ref: '#/components/schemas/Loans/properties/LoanName'
   *              LoanType:
   *                $ref: '#/components/schemas/Loans/properties/LoanType'
   *              LoanTerm:
   *                $ref: '#/components/schemas/Loans/properties/LoanTerm'
   *              StartingPrinciple:
   *                $ref: '#/components/schemas/Loans/properties/StartingPrinciple'
   *              InterestRate:
   *                $ref: '#/components/schemas/Loans/properties/InterestRate'
   *              PaymentMinimum:
   *                $ref: '#/components/schemas/Loans/properties/PaymentMinimum'
   *              PaymentStart:
   *                $ref: '#/components/schemas/Loans/properties/PaymentStart'
   */
  .post(async (req, res) => {
    try {
      let { UserID } = req.user;
      let { LoanName, LoanType, LoanTerm, StartingPrinciple, InterestRate, PaymentMinimum, PaymentStart } = req.body;

      let newLoan = await Loans.create({
        UserID,
        LoanName,
        LoanType,
        LoanTerm,
        StartingPrinciple,
        InterestRate,
        PaymentMinimum,
        PaymentStart
      });

      res.status(200).json({ status: "success", data: newLoan });
    } catch (err) {
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  });

router
  .route("/loans/:loanID")
  .put((req, res) => {})
  .delete((req, res) => {});

export default router;
