const express = require("express");
const userController = require("../Controller/UserController");
const QuestionController = require("../Controller/QuestionController");
const { Middleware } = require("../Util/Middleware");
const path = require("path");
const multer = require("multer");
const router = express.Router();

let ImageStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./public/Docs/");
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      "document" + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
let ImageDocs = multer({
  storage: ImageStorage,
});

// USER
router.post("/registerUser", userController.registerUser);
router.post("/loginUser", userController.loginUser);
router.get("/getAllUser", Middleware, userController.getAllUser);
router.get("/getUser", Middleware, userController.getUser);
router.put("/updateUser", Middleware, userController.updateUser);

//QUESTION
router.post("/createQuestion", Middleware, QuestionController.createQuestion);
router.get("/getAllQuestion", Middleware, QuestionController.getAllQuestion);
router.get("/getQuestion", Middleware, QuestionController.getQuestion);
router.put(
  "/updateQuestion",
  ImageDocs.single("file"),
  Middleware,
  QuestionController.updateQuestion
);

module.exports = router;
