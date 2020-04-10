import express from "express";
import validate, { getPaymentPlanRules, createPaymentPlanRules, updatePaymentPlanRules, deletePaymentPlanRules } from "../middleware/route-validator";
import { PaymentPlans as PaymentPlansModel, Payments as PaymentsModel } from "../models/models";

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
  .get(getPaymentPlanRules(), validate, async (req, res) => {
    try {
      let { UserID } = req.user;
      let paymentPlans = await PaymentPlansModel.findAll({
        where: { UserID },
        include: [
          {
            model: PaymentsModel
          }
        ]
      });

      res.status(200).json({ status: "success", data: paymentPlans });
    } catch (err) {
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
   *                    PaymentDate:
   *                      $ref: '#/components/schemas/Payments/properties/PaymentDate'
   *                    PaymentAmount:
   *                      $ref: '#/components/schemas/Payments/properties/PaymentAmount'
   *                    RecurringTypeID:
   *                      $ref: '#/components/schemas/Payments/properties/RecurringTypeID'
   *
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
  .post(createPaymentPlanRules(), validate, async (req, res) => {
    try {
      let { UserID } = req.user;
      let { PlanName, AllocationMethodID, IsCurrent, Payments } = req.body;

      // Create new payment plan
      let newPlan = await PaymentPlansModel.create({
        UserID,
        PlanName,
        AllocationMethodID,
        IsCurrent
      });

      // Loop through provided payments and create a promise to create payment
      let paymentCreationPromises = [];
      for (let payment of Payments) {
        let { PaymentDate, PaymentAmount, RecurringTypeID } = payment;

        paymentCreationPromises.push(
          PaymentsModel.create({
            PaymentPlanID: newPlan.PaymentPlanID,
            PaymentDate,
            PaymentAmount,
            RecurringTypeID
          })
        );
      }

      // Create new individual payments associated to new plan
      let newPayments = await Promise.all(paymentCreationPromises);

      res.status(200).json({ status: "success", data: { ...newPlan.toJSON(), Payments: newPayments.map(p => p.toJSON()) } });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  });

router
  .route("/payment-plans/:paymentPlanID")

  /**
   * @swagger
   *
   * /payment-plans/{PaymentPlanID}:
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
   */
  .put(updatePaymentPlanRules(), validate, async (req, res) => {
    try {
    } catch (err) {
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
  .delete(deletePaymentPlanRules(), validate, async (req, res) => {
    try {
    } catch (err) {
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  });

router
  .route("/payment-plans/:PaymentPlanID/schedule")
  .get((req, res) => {})
  .post((req, res) => {});

router
  .route("/payment-plans/:PaymentPlanID/Payment/:PaymentID")
  .put((req, res) => {})
  .delete((req, res) => {});

export default router;
