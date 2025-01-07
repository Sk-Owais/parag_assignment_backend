const router = require("express").Router();
const { createUserController } = require("../controllers/userControllers");
router.post("/create", createUserController);
module.exports = router;
