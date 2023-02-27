const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

//router.route("/").post(authController.signIn);
router.post("/", authController.signIn);


module.exports = router;
