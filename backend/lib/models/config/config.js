import dotenv from "dotenv";
dotenv.config();

const development = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: "mssql",
  dialectOptions: {
    options: {
      ...(process.env.DB_INSTANCE_NAME && {
        instanceName: process.env.DB_INSTANCE_NAME
      }),
      ...(process.env.DB_HOST.includes("windows.net") && { encrypt: true })
    }
  }
};

const staging = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: "mssql",
  dialectOptions: {
    options: {
      ...(process.env.DB_INSTANCE_NAME && {
        instanceName: process.env.DB_INSTANCE_NAME
      }),
      ...(process.env.DB_HOST.includes("windows.net") && { encrypt: true })
    }
  }
};

const production = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: "mssql",
  dialectOptions: {
    options: {
      ...(process.env.DB_INSTANCE_NAME && {
        instanceName: process.env.DB_INSTANCE_NAME
      }),
      ...(process.env.DB_HOST.includes("windows.net") && { encrypt: true })
    }
  }
};

let config = {};
switch (process.env.NODE_ENV) {
  case "development":
    config = development;

  case "staging":
    config = staging;

  case "production":
    config = production;

  default:
    config = development;
}

module.exports = config;
