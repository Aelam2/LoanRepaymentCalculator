import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    error: errors.array()[0].msg,
    errors: extractedErrors
  });
};

export default validate;
export * from "./userRules";
export * from "./loanRules";
export * from "./paymentPlanRules";
export * from "./analyticsRules";
