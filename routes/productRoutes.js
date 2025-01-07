const router = require("express").Router();
const { createProductController } = require("../controllers/productController");
router.post("/create", createProductController);
module.exports = router;
