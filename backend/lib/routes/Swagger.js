import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
let router = express.Router();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Student-Loan API",
      version: "1.0.0",
      description: "Student-Loan Calculator API documentation",
      contact: {
        name: "James Elam",
        email: "James@alexelam.dev"
      }
    },
    host: `${process.env.API_HOST}:${process.env.PORT}`,
    basePath: `${process.env.API_BASEPATH}`,
    components: {
      securitySchemes: {
        JWT: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: ""
        }
      }
    },
    security: [
      {
        JWT: []
      }
    ]
  },
  apis: ["lib/models/models/*.js", "lib/routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

router
  .use(swaggerUi.serve)
  .route("/")
  .get(swaggerUi.setup(swaggerDocs, { explorer: true }));

export default router;

/**
 * @swagger
 * components:
 *    schemas:
 *      FourZeroOne:
 *        description: User failed to authenticate
 *        type: object
 *      FourZeroNineError:
 *        description: An unexpected error occured in the application
 *        type: object
 *        properties:
 *          status:
 *            type: string
 *            example: error
 *          error:
 *            type: string
 *            description: User-friendly description of unique-constraint error in application
 *            example: UserName has already been taken
 *          result:
 *            type: object
 *            properties:
 *              codeName:
 *                type: string
 *                description: field where the unique-constraint error occured
 *                example: UserName
 *              value:
 *                type: string
 *                description: value that triggered the unique-constraint error
 *                example: AgentSparkles
 *      FourTwentyTwoError:
 *        description: An unexpected error occured in the application
 *        type: object
 *        properties:
 *          status:
 *            type: string
 *            example: error
 *          error:
 *            type: string
 *            description: User-friendly description of validation error in application
 *            example: Username must start with a letter, have no spaces, and be between 3 to 40 characters
 *          result:
 *            type: object
 *            properties:
 *              codeName:
 *                type: string
 *                description: field where the validation error occured
 *                example: UserName
 *              value:
 *                type: string
 *                description: value that triggered the validation error
 *                example: 1A
 *      FiveHundredError:
 *        description: An unexpected error occured in the application
 *        type: object
 *        properties:
 *          status:
 *            type: string
 *            example: error
 *          error:
 *            type: string
 *            description: Description of error in application
 *            example: An unexpected error occured
 *          result:
 *            type: object
 *            example: null
 */
