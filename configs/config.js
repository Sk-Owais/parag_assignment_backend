require("dotenv").config();

module.exports = {
  HOST: process.env.HOST || "localhost:1001",
  MICROSERVICE_API_APTH: process.env.MICROSERVICE_API_APTH || "/parag",
  PORT: process.env.PORT || "1001",
  DEBUG: true,
  ENCRYPTION_SECRET:
    process.env.ENCRYPTION_SECRET ||
    "08449ae4bca9031cc6997a15d431f0c990e1740e61b8502024fd8bcdcf88806e",
  ENCRYPTION_METHOD: process.env.ENCRYPTION_METHOD || " aes-256-cbc",
  JWT: {
    JWT_ISSUER: process.env.JWT_ISSUER || "Parag",
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || "Authentication Service",
    JWT_ALGORITHM: process.env.JWT_ALGORITHM || "RS256",
  },
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
