import express from "express";
import validate, { createLoanRules, updateLoanRules, deleteLoanRules } from "../middleware/route-validator";
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
   *                  type: array
   *                  items:
   *                      $ref: '#/components/schemas/Loans'
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
   *              LoanBalance:
   *                $ref: '#/components/schemas/Loans/properties/LoanBalance'
   *              InterestRate:
   *                $ref: '#/components/schemas/Loans/properties/InterestRate'
   *              PaymentMinimum:
   *                $ref: '#/components/schemas/Loans/properties/PaymentMinimum'
   *              PaymentStart:
   *                $ref: '#/components/schemas/Loans/properties/PaymentStart'
   *              StatusID:
   *                $ref: '#/components/schemas/Loans/properties/StatusID'
   *    responses:
   *      '200':
   *        description: New user account was successfully created
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
  .post(createLoanRules(), validate, async (req, res) => {
    try {
      let { UserID } = req.user;
      let { LoanName, LoanType, LoanTerm, LoanBalance, InterestRate, PaymentMinimum, PaymentStart } = req.body;

      let newLoan = await Loans.create({
        UserID,
        LoanName,
        LoanType,
        LoanTerm,
        LoanBalance,
        InterestRate,
        PaymentMinimum,
        PaymentStart
      });

      res.status(200).json({ status: "success", data: newLoan });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  });

router
  .route("/loans/:LoanID")

  /**
   * @swagger
   *
   * /me/loans/{LoanID}:
   *  put:
   *    description: Update an existing loan
   *    tags: [Loans]
   *    parameters:
   *      - in: path
   *        name: LoanID
   *        schema:
   *          $ref: '#/components/schemas/Loans/properties/LoanName'
   *        required: true
   *        description: Numeric ID of the loan
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              LoanName:
   *                $ref: '#/components/schemas/Loans/properties/LoanName'
   *              LoanType:
   *                $ref: '#/components/schemas/Loans/properties/LoanType'
   *              LoanTerm:
   *                $ref: '#/components/schemas/Loans/properties/LoanTerm'
   *              LoanBalance:
   *                $ref: '#/components/schemas/Loans/properties/LoanBalance'
   *              InterestRate:
   *                $ref: '#/components/schemas/Loans/properties/InterestRate'
   *              PaymentMinimum:
   *                $ref: '#/components/schemas/Loans/properties/PaymentMinimum'
   *              PaymentStart:
   *                $ref: '#/components/schemas/Loans/properties/PaymentStart'
   *              StatusID:
   *                $ref: '#/components/schemas/Loans/properties/StatusID'
   *    responses:
   *      '200':
   *        description: New user account was successfully created
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
  .put(updateLoanRules(), validate, async (req, res) => {
    try {
      let { UserID } = req.user;
      let { LoanID } = req.params;
      let { LoanName, LoanType, LoanTerm, LoanBalance, InterestRate, PaymentMinimum, PaymentStart } = req.body;

      // Update Loan via LoanID and UserID
      await Loans.update(
        {
          ...(LoanName && { LoanName }),
          ...(LoanType && { LoanType }),
          ...(LoanTerm && { LoanTerm }),
          ...(LoanBalance && { LoanBalance }),
          ...(InterestRate && { InterestRate }),
          ...(PaymentMinimum && { PaymentMinimum }),
          ...(PaymentStart && { PaymentStart })
        },
        { where: { LoanID, UserID } }
      );

      // Find and return updated Loan
      let updatedLoan = await Loans.findOne({
        where: { LoanID, UserID }
      });

      res.status(200).json({ status: "success", data: updatedLoan });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  })

  /**
   * @swagger
   *
   * /me/loans/{LoanID}:
   *  delete:
   *    description: Delete an existing loan by LoanID
   *    tags: [Loans]
   *    parameters:
   *      - in: path
   *        name: LoanID
   *        schema:
   *          $ref: '#/components/schemas/Loans/properties/LoanName'
   *        required: true
   *        description: Numeric ID of the loan
   *    responses:
   *      '200':
   *        description: New user account was successfully created
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
  .delete(deleteLoanRules(), validate, async (req, res) => {
    try {
      let { UserID } = req.user;
      let { LoanID } = req.params;

      let result = await Loans.destroy({
        where: { LoanID, UserID }
      });

      if (result != 1) res.status(404).json({ status: "error", data: null, error: "Loan does not exist for user" });

      res.status(200).json({ status: "success", data: LoanID });
    } catch (err) {
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  });

export default router;
