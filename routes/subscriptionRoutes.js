const router = require("express").Router();
const {
  createSubscriptionController,
  updateSubscriptionController,
  getAllSubscriptionController,
  deleteSubscriptionController,
} = require("../controllers/subscriptionController");

router.post("/", createSubscriptionController);
router.put("/:subscription_id", updateSubscriptionController);
router.delete("/:subscription_id", deleteSubscriptionController);
router.get("/:customer_id", getAllSubscriptionController);

module.exports = router;
