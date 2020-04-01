import { body, param } from "express-validator";

const getPaymentPlanRules = () => {
  return [body("PlanName", "Plan name is required").isLength({ min: 1 })];
};

const createPaymentPlanRules = () => {
  return [body("PlanName", "Plan name is required").isLength({ min: 1 })];
};

const updatePaymentPlanRules = () => {
  return [param("PaymentPlanID", "PaymentPlanID is required").isInt({ gt: 0 })];
};

const deletePaymentPlanRules = () => {
  return [param("PaymentPlanID", "PaymentPlanID is required").isInt({ gt: 0 })];
};

export { getPaymentPlanRules, createPaymentPlanRules, updatePaymentPlanRules, deletePaymentPlanRules };
