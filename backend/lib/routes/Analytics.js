import express from "express";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import logger from "../logging";
import { StrategyCodeValueIdMap } from "../helpers/repaymentStrategies";
import { Loans, PaymentPlans, Payments as PaymentsModel } from "../models/models";

let router = express.Router();

let workerFile = process.env.NODE_ENV === "production" ? "./workers/analyticsCalculator.js" : "./dist/workers/analyticsCalculator.js";

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Loans vs. Current Payment Plan
 */

/**
 * @swagger
 *
 * /me/loans/amortization:
 *  get:
 *    description: Creates a schedule of payments for a user's loans
 *    tags: [Analytics]
 *    parameters:
 *    - in: query
 *      name: consolidated
 *      schema:
 *        type: bool
 *      description: Whether to create seperate payment schedules for each loan or treat them as a single loan
 *    responses:
 *      '200':
 *        description: Sucessfully returned amortization schedule
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
 *                    type: object
 *                    properties:
 *                      LoanID:
 *                        $ref: '#/components/schemas/Loans/properties/LoanID'
 *                      LoanName:
 *                        $ref: '#/components/schemas/Loans/properties/LoanName'
 *                      schedule:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            PaymentDate:
 *                              type: string
 *                              format: date-time
 *                              required: true
 *                              description: Date/Month that payments took place in.
 *                            LoanBalance:
 *                              $ref: '#/components/schemas/Loans/properties/LoanBalance'
 *                            PaymentAmount:
 *                              $ref: '#/components/schemas/Payments/properties/PaymentAmount'
 *                            InterestAmount:
 *                              type: number
 *                              format: dobule
 *                              required: true
 *                              description: Amount of payment that went towards interest.
 *                            InterestCumulative:
 *                              type: number
 *                              format: dobule
 *                              required: true
 *                              description: Running total of payment amounts that went towards payments
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
router.route("/amortization").get(async (req, res) => {
  let { UserID } = req.user;
  let { hidden = "" } = req.query;

  try {
    let hiddenLoans = hidden.split(",");

    // Get all active loans for a user
    let currentLoans = await Loans.findAll({
      where: { UserID }
    });

    // Attempt to fetch any active payment plans and their associated payments
    let currentPlan = await PaymentPlans.findOne({
      where: { IsCurrent: 1, UserID },
      include: [
        {
          model: PaymentsModel
        }
      ]
    });

    // Loans that have not been hidden by user
    let activeLoans = currentLoans.map(l => l.toJSON()).filter(l => !hiddenLoans.some(hl => hl == l.LoanID));
    let AllocationMethodID = currentPlan && currentPlan.hasOwnProperty("AllocationMethodID") ? currentPlan.AllocationMethodID : 4;
    let payments = currentPlan && currentPlan.hasOwnProperty("Payments") ? currentPlan.Payments.map(p => p.toJSON()) : [];

    // Cache Keys to check for
    let cacheMinimumKey = `amortization:minimum:${req.user.UserID}:hidden=${hiddenLoans}`;
    let cacheCurrentKey = currentPlan ? `amortization:current:${currentPlan.PaymentPlanID}:hidden=${hiddenLoans}` : undefined;

    // Start Analytic Calculations in seperate process
    const worker = new Worker(workerFile, {
      workerData: {
        loans: activeLoans,
        strategyType: StrategyCodeValueIdMap[AllocationMethodID],
        payments: payments,
        currentPlan: currentPlan ? currentPlan.toJSON() : null,
        cacheMinimumKey,
        cacheCurrentKey
      }
    });

    // Retrieve calculations on process finish
    worker.on("message", analytics => {
      let { minimumAnalytics, currentAnalytics, cachedMinimumAnalytics, cachedCurrentAnalytics } = analytics;

      logger.info("Loan Analytics Success", { UserID, hidden });

      // Return loan information with array of scheduled payments
      res.status(200).json({ status: "success", data: { ...currentAnalytics, minimumPlan: minimumAnalytics } });
    });

    worker.on("error", err => {
      logger.error(`Loan Analytics Failed with exception ${err.message}`, { UserID, hidden });
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    });
  } catch (err) {
    logger.error(`Loan Analytics Failed with exception ${err.message}`, { UserID, hidden });
    res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
  }
});

export default router;
