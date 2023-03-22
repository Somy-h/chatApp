const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();
const verifyJwt = require("../middleware/verifyJwt");
const imageUpload = require("../utils/image-upload");

router.post("/", userController.createUser);

router.use(verifyJwt);
router.get("/:id", userController.getUser);
router.patch("/:id", imageUpload, userController.updateUser);
  
module.exports = router;
