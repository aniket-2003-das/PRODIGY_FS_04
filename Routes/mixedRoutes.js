const express = require("express");
const Router = express.Router();
const friendfunctions = require("../Controllers/friendController.js");
const userFunctions = require("../Controllers/userControllers");

Router.route("/sendRequest").post(
  userFunctions.protect,
  friendfunctions.sendRequest
);
Router.route("/getFriendRequests").get(
  userFunctions.protect,
  friendfunctions.getFriendRequests
);
Router.route("/getListOfFriends").get(
  userFunctions.protect,
  friendfunctions.getListOfFriends
);
Router.route("/accept").post(userFunctions.protect, friendfunctions.addAFriend);
Router.route("/delete").post(
  userFunctions.protect,
  friendfunctions.deleteAFriend
);

module.exports = Router;
