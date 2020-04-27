import apm from "elastic-apm-node";
import dotenv from "dotenv";
import winston from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";

dotenv.config();

apm.start({
  serverUrl: process.env.APM_URL,
  secretToken: process.env.APM_SECRET_TOKEN,
  environment: process.env.NODE_ENV === "production" ? "production" : "development"
});

const esTransportOpts = {
  apm,
  level: "info",
  clientOpts: {
    node: process.env.ELASTIC_URL,
    auth: {
      username: process.env.ELASTIC_USERNAME,
      password: process.env.ELASTIC_PASSWORD
    },
    log: "info"
  },
  transformer: logData => {
    return {
      "@timestamp": new Date().getTime(),
      severity: logData.level,
      message: `[${logData.level}] LOG Message: ${logData.message}`,
      fields: {
        ...logData.meta
      }
    };
  }
};

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logfile.log", level: "error" }), //save errors on file
    new ElasticsearchTransport(esTransportOpts) //everything info and above goes to elastic
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      //we also log to console if we're not in production
      format: winston.format.simple()
    })
  );
}

export default logger;
