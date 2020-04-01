import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ error: err.msg, codeName: err.param, value: err.value }));

  const firstError = errors.array()[0];

  return res.status(422).json({
    status: "error",
    error: firstError.msg,
    result: {
      codeName: firstError.param,
      value: firstError.value
    },
    errors: extractedErrors
  });
};

export default validate;
export * from "./userRules";
export * from "./loanRules";
export * from "./paymentPlanRules";
export * from "./analyticsRules";
