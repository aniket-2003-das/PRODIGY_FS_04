const express = require("express");
const Router = express.Router();
const userFunctions = require("../Controllers/userControllers");

Router.route("/signup").post(userFunctions.signup);
Router.route("/:id").get(userFunctions.getAUser);
Router.route("/login").post(userFunctions.login);
Router.route("/logout").delete(userFunctions.protect, userFunctions.logout);
Router.route("/verify/:userId/:uniqueString").get(userFunctions.verify);

module.exports = Router;
