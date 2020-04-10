import { body, param } from "express-validator";

const createLoanRules = () => {
  return [
    body("LoanName", "Invalid loan name inputted").isLength({ min: 1 }),
    body("LoanTypeID", "Invalid loan type inputted").isInt(),
    // body("LoanTerm", "Loan term must be greated than 0").isInt({ gt: 0 }),
    body("LoanBalance", "Starting loan balance must be greater than 0").isFloat({ gt: 0 }),
    body("InterestRate", "Interest rate must be a positive number").isFloat({ min: 0 }),
    body("PaymentMinimum", "Minimum payment must be greater than 0").isFloat({ gt: 0 }),
    body("PaymentStart", "Invalid start date").isISO8601()
  ];
};

const updateLoanRules = () => {
  return [
    body("LoanName", "Invalid loan name inputted").isLength({ min: 1 }),
    body("LoanTypeID", "Invalid loan type inputted").isInt(),
    // body("LoanTerm", "Loan term must be greated than 0").isInt({ gt: 0 }),
    body("LoanBalance", "Starting loan balance must be greater than 0").isFloat({ gt: 0 }),
    body("InterestRate", "Interest rate must be a positive number").isFloat({ min: 0 }),
    body("PaymentMinimum", "Minimum payment must be greater than 0").isFloat({ gt: 0 }),
    body("PaymentStart", "Invalid start date").isISO8601()
  ];
};

const deleteLoanRules = () => {
  return [];
};

export { createLoanRules, updateLoanRules, deleteLoanRules };
