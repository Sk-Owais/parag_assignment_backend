require("dotenv").config();

module.exports = {
  HOST: process.env.HOST || "localhost:1001",
  MICROSERVICE_API_APTH: process.env.MICROSERVICE_API_APTH || "/parag",
  PORT: process.env.PORT || "1001",
  DEBUG: true,
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
};
