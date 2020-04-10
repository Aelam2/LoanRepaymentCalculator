import { body, param } from "express-validator";

const getPaymentPlanRules = () => {
  return [];
};

const createPaymentPlanRules = () => {
  return [
    body("PlanName", "Plan name is required").isLength({ min: 1 }),
    body("AllocationMethodID", "Allocation method is required").isLength({ min: 1 }),
    body("IsCurrent", "Plan activation must be specified").isInt({ min: 0, max: 1 }),
    body("Payments", "Plan activation must be specified").isArray(),
    body("Payments.*.PaymentDate", "Payment must have a valid date").isISO8601(),
    body("Payments.*.PaymentAmount", "Payment Amount must be a number").isFloat({ min: 1 }),
    body("Payments.*.RecurringTypeID", "Payment reccurement must be specified").isInt()
  ];
};

const updatePaymentPlanRules = () => {
  return [param("PaymentPlanID", "PaymentPlanID is required").isInt({ gt: 0 })];
};

const deletePaymentPlanRules = () => {
  return [param("PaymentPlanID", "PaymentPlanID is required").isInt({ gt: 0 })];
};

export { getPaymentPlanRules, createPaymentPlanRules, updatePaymentPlanRules, deletePaymentPlanRules };
