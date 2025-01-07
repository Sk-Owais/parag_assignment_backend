require("dotenv").config();

const { Sequelize } = require("sequelize");

const {
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE_NAME,
} = process.env;

const sequelize = new Sequelize({
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE_NAME,
  dialect: "mysql",
  logQueryParameters: false,
  logging: false,
});

const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.debug("Connected successfully to database");
  } catch (error) {
    console.debug({ error });
    console.debug("Error while connecting database");
  }
};

module.exports = { connectDb, sequelize };
