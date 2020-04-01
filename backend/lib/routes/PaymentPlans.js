import express from "express";
import validate, { getPaymentPlanRules, createPaymentPlanRules, updatePaymentPlanRules, deletePaymentPlanRules } from "../middleware/route-validator";
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
   * /payment-plans:
   *  get:
   *    description: Get a list of all payment plans
   *    tags: [Payment Plans]
   */
  .get(getPaymentPlanRules(), validate, async (req, res) => {
    try {
    } catch (err) {
      res.status(500).json({ status: "error", data: null, error: "an unexpected error occured" });
    }
  })

  /**
   * @swagger
   *
   * /payment-plans:
   *  post:
   *    description: Create a new payment plan
   *    tags: [Payment Plans]
   */
  .post(createPaymentPlanRules(), validate, async (req, res) => {
    try {
    } catch (err) {
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
