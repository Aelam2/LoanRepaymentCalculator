import express from "express";
import logger from "../logging";
import validate, {
  getPaymentPlanRules,
  createPaymentPlanRules,
  activatePaymentPlanRules,
  updatePaymentPlanRules,
  deletePaymentPlanRules
} from "../middleware/route-validator";
import { getRouteCache, clearCacheCascade } from "../middleware/cache";
import { PaymentPlans as PaymentPlansModel, Payments as PaymentsModel, CodeSets as CodeSetsModel } from "../models/models";
import { Sequelize } from "../models/models";

let Op = Sequelize.Op;
let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment Plans
 *   description: User's Payment Plans
 */

router
  .route("/payment-plans")

  /**
   * @swagger
   *
   * /me/payment-plans:
   *  get:
   *    description: Get a list of all payment plans
   *    tags: [Payment Plans]
   *    responses:
   *      '200':
   *        description: Retrieve all non-deleted Payment Plans created by a user
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
   *                    properties:
   *                      PaymentPlanID:
   *                        $ref: '#/components/schemas/PaymentPlans/properties/PaymentPlanID'
   *                      UserID:
   *                        $ref: '#/components/schemas/PaymentPlans/properties/UserID'
   *                      PlanName:
   *                        $ref: '#/components/schemas/PaymentPlans/properties/PlanName'
   *                      AllocationMethodID:
   *                        $ref: '#/components/schemas/PaymentPlans/properties/AllocationMethodID'
   *                      IsCurrent:
   *                        $ref: '#/components/schemas/PaymentPlans/properties/IsCurrent'
   *                      DateCreated:
   *                        $ref: '#/components/schemas/PaymentPlans/properties/DateCreated'
   *                      DateUpdated:
   *                        $ref: '#/components/schemas/PaymentPlans/properties/DateUpdated'
   *                      DateDeleted:
   *                        $ref: '#/components/schemas/PaymentPlans/properties/DateDeleted'
   *                      Payments:
   *                        type: array
   *                        items:
   *                          $ref: '#/components/schemas/Payments'
   *      '500':
   *         description: An unexpected error occured
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FiveHundredError'
   */
  .get(getPaymentPlanRules(), validate, getRouteCache(0), async (req, res) => {
    let { UserID } = req.user;

    try {
      let paymentPlans = await PaymentPlansModel.findAll({
        where: { UserID },
        include: [
          {
            model: PaymentsModel,
            include: [
              {
                model: CodeSetsModel,
                required: true,
                as: "RecurringType"
              }
            ]
          },
          {
            model: CodeSetsModel,
            required: true,
            as: "AllocationMethod"
          }
        ]
      });
      logger.info("Get Payment Plans", { UserID });

      res.status(200).json({ status: "success", data: paymentPlans.map(p => p.toJSON()) });
    } catch (err) {
      logger.error(`Get Payment Plans Failed with exception ${err.message}`, { UserID }); //prettier-ignore
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  })

  /**
   * @swagger
   *
   * /me/payment-plans:
   *  post:
   *    description: Create a new payment plan
   *    tags: [Payment Plans]
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - PlanName
   *              - AllocationMethodID
   *              - IsCurrent
   *              - Payments
   *            properties:
   *              PlanName:
   *                $ref: '#/components/schemas/PaymentPlans/properties/PlanName'
   *              AllocationMethodID:
   *                $ref: '#/components/schemas/PaymentPlans/properties/AllocationMethodID'
   *              IsCurrent:
   *                $ref: '#/components/schemas/PaymentPlans/properties/IsCurrent'
   *              Payments:
   *                type: array
   *                items:
   *                  type: object
   *                  properties:
   *                    PaymentName:
   *                      $ref: '#/components/schemas/Payments/properties/PaymentName'
   *                    PaymentDate:
   *                      $ref: '#/components/schemas/Payments/properties/PaymentDate'
   *                    PaymentDateEnd:
   *                      $ref: '#/components/schemas/Payments/properties/PaymentDateEnd'
   *                    PaymentAmount:
   *                      $ref: '#/components/schemas/Payments/properties/PaymentAmount'
   *                    RecurringTypeID:
   *                      $ref: '#/components/schemas/Payments/properties/RecurringTypeID'
   *    responses:
   *      '200':
   *        description: New payment plan and initial payments were successfully created
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
   *                  properties:
   *                    PlanName:
   *                      $ref: '#/components/schemas/PaymentPlans/properties/PlanName'
   *                    AllocationMethodID:
   *                      $ref: '#/components/schemas/PaymentPlans/properties/AllocationMethodID'
   *                    IsCurrent:
   *                      $ref: '#/components/schemas/PaymentPlans/properties/IsCurrent'
   *                    Payments:
   *                      type: array
   *                      items:
   *                        $ref: '#/components/schemas/Payments'
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
  .post(createPaymentPlanRules(), validate, clearCacheCascade("amortization"), clearCacheCascade("/payment-plans"), async (req, res) => {
    let { UserID } = req.user;
    let { PlanName, AllocationMethodID, IsCurrent = 0, Payments } = req.body;

    try {
      let currentPlan = await PaymentPlansModel.findOne({
        where: {
          UserID,
          IsCurrent: 1
        }
      });

      // If user has no current plans, default to IsCurrent = 1
      IsCurrent = !currentPlan ? 1 : 0;

      // Create new payment plan
      let newPlan = await PaymentPlansModel.create({
        UserID,
        PlanName,
        AllocationMethodID,
        IsCurrent
      });

      if (!newPlan.PaymentPlanID) throw new Error("Error creating parent payment plan");

      // Loop through provided payments and create a promise to create payment
      let paymentCreationPromises = [];

      for (let payment of Payments) {
        let { PaymentDate, PaymentDateEnd, PaymentName, PaymentAmount, RecurringTypeID } = payment;

        paymentCreationPromises.push(
          PaymentsModel.create({
            PaymentPlanID: newPlan.PaymentPlanID,
            PaymentName,
            PaymentDate,
            ...(PaymentDateEnd && { PaymentDateEnd }),
            PaymentAmount,
            RecurringTypeID
          })
        );
      }

      // Create new individual payments associated to new plan
      await Promise.all(paymentCreationPromises);

      // Fetch new plan one more time with code values included from codeset table
      let finalizedPlan = await PaymentPlansModel.findOne({
        where: { UserID, PaymentPlanID: newPlan.PaymentPlanID },
        include: [
          {
            model: PaymentsModel,
            include: [
              {
                model: CodeSetsModel,
                required: true,
                as: "RecurringType"
              }
            ]
          },
          {
            model: CodeSetsModel,
            required: true,
            as: "AllocationMethod"
          }
        ]
      });

      logger.info("Create Payment Plans Success", { UserID, PlanName, AllocationMethodID, IsCurrent, Payments });
      res.status(200).json({ status: "success", data: finalizedPlan });
    } catch (err) {
      logger.error(`Create Payment Plan Failed with exception ${err.message}`, { UserID, PlanName, AllocationMethodID, IsCurrent, Payments });
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  });

/**
 * @swagger
 *
 * /me/payment-plans/{PaymentPlanID}/activate:
 *  post:
 *    description: Set a payment plan to IsCurrent = (0 | 1). This will set all other plans to
 *    tags: [Payment Plans]
 *    parameters:
 *      - in: path
 *        name: PaymentPlanID
 *        schema:
 *          $ref: '#/components/schemas/PaymentPlans/properties/PaymentPlanID'
 *        required: true
 *        description: Numeric ID of the PaymentPlan
 *    requestBody:
 *      required: false
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - IsCurrent
 *            properties:
 *              IsCurrent:
 *                $ref: '#/components/schemas/PaymentPlans/properties/IsCurrent'
 *    responses:
 *      '200':
 *        description: New payment plan and initial payments were successfully created
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
 *                  properties:
 *                    PaymentPlanID:
 *                      $ref: '#/components/schemas/PaymentPlans/properties/PaymentPlanID'
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
router.route("/payment-plans/:PaymentPlanID/activate").post(activatePaymentPlanRules(), validate, clearCacheCascade("/payment-plans"), async (req, res) => {
  let { UserID } = req.user;
  let { PaymentPlanID } = req.params;
  let { IsCurrent = 1 } = req.body;

  try {
    // Set all other plans to IsCurrent = 0
    await PaymentPlansModel.update(
      {
        IsCurrent: 0
      },
      {
        where: {
          UserID
        }
      }
    );

    // Set requested payment plan to requested status
    await PaymentPlansModel.update(
      {
        IsCurrent
      },
      {
        where: {
          UserID,
          PaymentPlanID
        },
        returning: true,
        plain: true
      }
    );

    logger.info("Activate Payment Plan Success", { UserID, PaymentPlanID, IsCurrent });
    res.status(200).json({ status: "success", data: PaymentPlanID });
  } catch (err) {
    logger.error(`Activate Payment Plan Failed with exception ${err.message}`, { UserID, PaymentPlanID, IsCurrent });
    res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
  }
});

router
  .route("/payment-plans/:PaymentPlanID")

  /**
   * @swagger
   *
   * /me/payment-plans/{PaymentPlanID}:
   *  put:
   *    description: Update properties of an existing payment plan
   *    tags: [Payment Plans]
   *    parameters:
   *      - in: path
   *        name: PaymentPlanID
   *        schema:
   *          $ref: '#/components/schemas/PaymentPlans/properties/PaymentPlanID'
   *        required: true
   *        description: Numeric ID of the PaymentPlan
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - PlanName
   *              - AllocationMethodID
   *              - IsCurrent
   *              - Payments
   *            properties:
   *              PlanName:
   *                $ref: '#/components/schemas/PaymentPlans/properties/PlanName'
   *              AllocationMethodID:
   *                $ref: '#/components/schemas/PaymentPlans/properties/AllocationMethodID'
   *              Payments:
   *                type: array
   *                items:
   *                  type: object
   *                  properties:
   *                    PaymentID:
   *                      $ref: '#/components/schemas/Payments/properties/PaymentID'
   *                    PaymentName:
   *                      $ref: '#/components/schemas/Payments/properties/PaymentName'
   *                    PaymentDate:
   *                      $ref: '#/components/schemas/Payments/properties/PaymentDate'
   *                    PaymentAmount:
   *                      $ref: '#/components/schemas/Payments/properties/PaymentAmount'
   *                    RecurringTypeID:
   *                      $ref: '#/components/schemas/Payments/properties/RecurringTypeID'
   *    responses:
   *      '200':
   *        description: New payment plan and initial payments were successfully created
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
   *                  properties:
   *                    PlanName:
   *                      $ref: '#/components/schemas/PaymentPlans/properties/PlanName'
   *                    AllocationMethodID:
   *                      $ref: '#/components/schemas/PaymentPlans/properties/AllocationMethodID'
   *                    IsCurrent:
   *                      $ref: '#/components/schemas/PaymentPlans/properties/IsCurrent'
   *                    Payments:
   *                      type: array
   *                      items:
   *                        $ref: '#/components/schemas/Payments'
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
  .put(updatePaymentPlanRules(), validate, clearCacheCascade("amortization"), clearCacheCascade("/payment-plans"), async (req, res) => {
    let { UserID } = req.user;
    let { PaymentPlanID } = req.params;
    let { PlanName, AllocationMethodID, Payments = [] } = req.body;

    try {
      // Array of promises for executing db commands
      let dbPromises = [];

      // Fetch Plan via UserID included to verify PaymentPlanID belongs to them
      let userPaymentPlan = await PaymentPlansModel.findOne({
        where: {
          UserID,
          PaymentPlanID
        },
        include: [{ model: PaymentsModel }]
      });

      let currentPayments = userPaymentPlan.toJSON().Payments || [];

      // Update exisiting payment plan details if there are any changes
      if (userPaymentPlan.PlanName !== PlanName || userPaymentPlan.AllocationMethodID !== AllocationMethodID) {
        dbPromises.push(
          PaymentPlansModel.update(
            {
              ...(PlanName && { PlanName }),
              ...(AllocationMethodID && { AllocationMethodID })
            },
            {
              where: {
                UserID,
                PaymentPlanID
              }
            }
          )
        );
      }

      // CREATE PAYMENTS
      // Filter requested payments that have no PaymentID and create
      Payments.filter(p => !p.PaymentID).forEach(p => {
        let { PaymentName, PaymentDate, PaymentDateEnd, PaymentAmount, RecurringTypeID } = p;

        dbPromises.push(
          PaymentsModel.create({
            PaymentPlanID,
            PaymentName,
            PaymentDate,
            ...(PaymentDateEnd && { PaymentDateEnd }),
            PaymentAmount,
            RecurringTypeID
          })
        );
      });

      // UPDATE PAYMENTS
      // Filter Payments that have a PaymentID and make sure they previously existed
      Payments.filter(p1 => currentPayments.some(p2 => p2.PaymentID === p1.PaymentID)).forEach(p => {
        let { PaymentID, PaymentName, PaymentDate, PaymentDateEnd, PaymentAmount, RecurringTypeID } = p;

        dbPromises.push(
          PaymentsModel.update(
            {
              ...(PaymentName && { PaymentName }),
              ...(PaymentDate && { PaymentDate }),
              ...(PaymentDateEnd && { PaymentDateEnd }),
              ...(PaymentAmount && { PaymentAmount }),
              ...(RecurringTypeID && { RecurringTypeID })
            },
            {
              where: {
                PaymentPlanID,
                PaymentID
              }
            }
          )
        );
      });

      // DELETE PAYMENTS
      // Filter payments that previously existed, but were not sent with the current request
      currentPayments
        .filter(p1 => !Payments.some(p2 => p2.PaymentID === p1.PaymentID))
        .forEach(p => {
          let { PaymentID } = p;
          dbPromises.push(
            PaymentsModel.destroy({
              where: {
                PaymentPlanID,
                PaymentID
              }
            })
          );
        });

      // Create Update and Delete all payments synchronously
      await Promise.all(dbPromises);

      // Fetch newly updated payment plan with CodeSet values
      let updatedPlan = await PaymentPlansModel.findOne({
        where: { UserID, PaymentPlanID },
        include: [
          {
            model: PaymentsModel,
            include: [
              {
                model: CodeSetsModel,
                required: true,
                as: "RecurringType"
              }
            ]
          },
          {
            model: CodeSetsModel,
            required: true,
            as: "AllocationMethod"
          }
        ]
      });

      logger.info("Update Payment Plans Success", { UserID, PaymentPlanID, PlanName, AllocationMethodID, Payments });
      res.status(200).json({ status: "success", data: updatedPlan });
    } catch (err) {
      logger.error(`Update Payment Plans Failed with exception ${err.message}`, { UserID, PaymentPlanID, PlanName, AllocationMethodID, Payments });
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  })

  /**
   * @swagger
   *
   * /payment-plans/{PaymentPlanID}:
   *  delete:
   *    description: delete an existing payment plan by PaymentPlanID
   *    tags: [Payment Plans]
   *    parameters:
   *      - in: path
   *        name: PaymentPlanID
   *        schema:
   *          $ref: '#/components/schemas/PaymentPlans/properties/PaymentPlanID'
   *        required: true
   *        description: Numeric ID of the PaymentPlan
   */
  .delete(deletePaymentPlanRules(), validate, clearCacheCascade("amortization"), clearCacheCascade("/payment-plans"), async (req, res) => {
    let { UserID } = req.user;
    let { PaymentPlanID } = req.params;

    try {
      let result = await PaymentPlansModel.destroy({
        where: { PaymentPlanID, UserID }
      });

      if (result != 1) res.status(404).json({ status: "error", data: null, error: "Payment plan does not exist for user" });

      logger.info("Delete Payment Plan Success", { UserID, PaymentPlanID });
      res.status(200).json({ status: "success", data: PaymentPlanID });
    } catch (err) {
      logger.error(`Delete Payment Plan Failed with exception ${err.message}`, { UserID, PaymentPlanID });
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  });

export default router;
