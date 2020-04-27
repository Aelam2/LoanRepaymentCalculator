import express from "express";
import logger from "../logging";
import validate, { createLoanRules, updateLoanRules, deleteLoanRules } from "../middleware/route-validator";
import { getRouteCache, clearCacheCascade } from "../middleware/cache";
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
  .get(getRouteCache(0), async (req, res) => {
    let { UserID } = req.user;

    try {
      let activeLoans = await Loans.findAll({
        where: { UserID }
      });

      logger.info(`Get Loans Success`, { UserID });
      res.status(200).json({ status: "success", data: activeLoans.map(l => l.toJSON()) });
    } catch (err) {
      logger.error(`Get Loans Failed with exception ${err.message}`, { UserID });
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
   *              - LoanTypeID
   *              - LoanTerm
   *              - StartingPrinciple
   *              - InterestRate
   *              - PaymentMinimum
   *              - PaymentStart
   *            properties:
   *              LoanName:
   *                $ref: '#/components/schemas/Loans/properties/LoanName'
   *              LoanTypeID:
   *                $ref: '#/components/schemas/Loans/properties/LoanTypeID'
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
   *        description: New loan was sucessfully added to user's account
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
  .post(createLoanRules(), validate, clearCacheCascade("amortization"), clearCacheCascade("loans"), async (req, res) => {
    let { UserID } = req.user;
    let { LoanName, LoanTypeID, LoanTerm, LoanBalance, InterestRate, PaymentMinimum, PaymentStart } = req.body;

    try {
      let newLoan = await Loans.create({
        UserID,
        LoanName,
        LoanTypeID,
        LoanTerm,
        LoanBalance,
        InterestRate,
        PaymentMinimum,
        PaymentStart
      });

      logger.info("Create Loan Success", { UserID, LoanName, LoanTypeID, LoanTerm, LoanBalance, InterestRate, PaymentMinimum, PaymentStart });
      res.status(200).json({ status: "success", data: newLoan });
    } catch (err) {
      logger.error(`Create Loan Failed with exception ${err.message}`, { UserID, LoanName, LoanTypeID, LoanTerm, LoanBalance, InterestRate, PaymentMinimum, PaymentStart }); //prettier-ignore
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
   *              LoanTypeID:
   *                $ref: '#/components/schemas/Loans/properties/LoanTypeID'
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
   *        description: Exisiting loan was successfully updated
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
  .put(updateLoanRules(), validate, clearCacheCascade("amortization"), clearCacheCascade("loans"), async (req, res) => {
    let { UserID } = req.user;
    let { LoanID } = req.params;
    let { LoanName, LoanTypeID, LoanTerm, LoanBalance, InterestRate, PaymentMinimum, PaymentStart } = req.body;

    try {
      // Update Loan via LoanID and UserID
      await Loans.update(
        {
          ...(LoanName && { LoanName }),
          ...(LoanTypeID && { LoanTypeID }),
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

      logger.info("Update Loan Success", { UserID, LoanID, LoanName, LoanTypeID, LoanTerm, LoanBalance, InterestRate, PaymentMinimum, PaymentStart });

      res.status(200).json({ status: "success", data: updatedLoan });
    } catch (err) {
      logger.error(`Update Loan Failed with exception ${err.message}`, { UserID, LoanName, LoanTypeID, LoanTerm, LoanBalance, InterestRate, PaymentMinimum, PaymentStart }); //prettier-ignore
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
   *          $ref: '#/components/schemas/Loans/properties/LoanID'
   *        required: true
   *        description: Numeric ID of the loan
   *    responses:
   *      '200':
   *        description: Loan was successfully deleted
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  example: success
   *                data:
   *                  type: integer
   *                  $ref: '#/components/schemas/Loans/properties/LoanID'
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
  .delete(deleteLoanRules(), validate, clearCacheCascade("amortization"), clearCacheCascade("loans"), async (req, res) => {
    let { UserID } = req.user;
    let { LoanID } = req.params;

    try {
      let result = await Loans.destroy({
        where: { LoanID, UserID }
      });

      if (result != 1) {
        logger.warning("Delete Loan Warning, does not exist", { UserID, LoanID });
        res.status(404).json({ status: "error", data: null, error: "Loan does not exist for user" });
      }

      logger.info("Delete Loan Success", { UserID, LoanID });

      res.status(200).json({ status: "success", data: LoanID });
    } catch (err) {
      logger.error(`Delete Loan Success Failed with exception ${err.message}`, { UserID, LoanID });
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  });

export default router;
