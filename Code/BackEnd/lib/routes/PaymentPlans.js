import express from "express";
let router = express.Router();

router
  .route("/payment-plans")
  .get((req, res) => {})
  .post((req, res) => {});

router
  .route("/payment-plans/:paymentPlanID")
  .put((req, res) => {})
  .delete((req, res) => {});

router
  .route("/payment-plans/:PaymentPlanID/Payments")
  .get((req, res) => {})
  .post((req, res) => {});

router
  .route("/payment-plans/:PaymentPlanID/Payment/:PaymentID")
  .put((req, res) => {})
  .delete((req, res) => {});

export default router;
