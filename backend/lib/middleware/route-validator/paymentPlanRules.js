import { body, param } from "express-validator";

const getPaymentPlanRules = () => {
  return [];
};

const createPaymentPlanRules = () => {
  return [
    body("PlanName", "Plan name is required").isLength({ min: 1 }),
    body("AllocationMethodID", "Allocation method is required").isLength({ min: 1 }),
    body("IsCurrent", "Plan activation must be specified via 'IsCurrent' = 1 | 0").isInt({ min: 0, max: 1 }),
    body("Payments", "An Array of payments must be provided").isArray(),
    body("Payments.*.PaymentDate", "Payment must have a valid date").isISO8601(),
    body("Payments.*.PaymentAmount", "Payment Amount must be a number").isFloat({ min: 1 }),
    body("Payments.*.RecurringTypeID", "Payment reccurement must be specified").isInt()
  ];
};

const activatePaymentPlanRules = () => {
  return [param("PaymentPlanID", "PaymentPlanID is required").isInt({ min: 0 }), body("IsCurrent").isInt({ min: 0, max: 1 })];
};

const updatePaymentPlanRules = () => {
  return [
    param("PaymentPlanID", "PaymentPlanID is required").isInt({ min: 0 }),
    body("Payments", "An Array of payments must be provided").isArray(),
    body("Payments.*.PaymentDate", "Payment must have a valid date").isISO8601(),
    body("Payments.*.PaymentAmount", "Payment Amount must be a number").isFloat({ min: 1 }),
    body("Payments.*.RecurringTypeID", "Payment reccurement must be specified").isInt()
  ];
};

const deletePaymentPlanRules = () => {
  return [param("PaymentPlanID", "PaymentPlanID is required").exists().toInt().isInt({ gt: 0 })];
};

export { getPaymentPlanRules, createPaymentPlanRules, activatePaymentPlanRules, updatePaymentPlanRules, deletePaymentPlanRules };
