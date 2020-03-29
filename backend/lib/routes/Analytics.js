import express from "express";
let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Loans vs. Current Payment Plan
 */

router.route("/chart-analytics").get((req, res) => {});

router.route("/aggregate-analytics").get((req, res) => {});

export default router;
