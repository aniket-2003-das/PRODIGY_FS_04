const express = require("express");
const Router = express.Router();
const roomfunctions = require("../Controllers/roomController.js");

Router.route("/createRoom").post(roomfunctions.createRoom);
Router.route("/joinRoom").post(roomfunctions.getRoom);

module.exports = Router;
