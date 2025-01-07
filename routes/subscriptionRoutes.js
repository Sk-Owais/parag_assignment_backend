const router = require("express").Router();
const {
  createSubscriptionController,
  updateSubscriptionController,
  getAllSubscriptionController,
  deleteSubscriptionController,
} = require("../controllers/subscriptionController");
const { checkCustomerAccessToken } = require("../middleware/basicMiddleware");

router.post("/", checkCustomerAccessToken, createSubscriptionController);
router.put(
  "/:subscription_id",
  checkCustomerAccessToken,
  updateSubscriptionController
);
router.delete(
  "/:subscription_id",
  checkCustomerAccessToken,
  deleteSubscriptionController
);
router.get(
  "/:customer_id",
  checkCustomerAccessToken,
  getAllSubscriptionController
);

module.exports = router;
