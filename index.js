const express = require("express");
const { PORT, MICROSERVICE_API_APTH } = require("./configs/config");
const { connectDb } = require("./configs/db");
const indexRoute = require("./routes/indexRoutes");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`${MICROSERVICE_API_APTH}`, indexRoute);
connectDb();

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
