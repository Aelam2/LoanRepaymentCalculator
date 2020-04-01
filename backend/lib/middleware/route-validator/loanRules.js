import { body } from "express-validator";

const createLoan = () => {
  return [
    body("LoanName").isLength({ min: 1 }),
    body("LoanType")
      .isLength({ min: 1 })
      .isAlphanumeric(),
    body("LoanTerm").isInt({ gt: 0 }),
    body("LoanBalance").isFloat({ gt: 0 }),
    body("InterestRate").isFloat({ min: 0 }),
    body("PaymentMinimum").isFloat({ gt: 0 }),
    body("PaymentStart").isISO8601()
  ];
};

export { createLoan };
