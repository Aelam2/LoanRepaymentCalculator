import express from "express";
let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: User's Loans
 */

router
  .route("/loans")
  .get((req, res) => {})
  .post((req, res) => {});

router
  .route("/loans/:loanID")
  .put((req, res) => {})
  .delete((req, res) => {});

export default router;
