const router = require("express").Router();
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const subscriptionRoutes = require("./subscriptionRoutes");

router.use("/user", userRoutes);

router.use("/product", productRoutes);

router.use("/subscription", subscriptionRoutes);

module.exports = router;
