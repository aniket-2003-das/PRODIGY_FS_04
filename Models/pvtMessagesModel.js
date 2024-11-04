const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  Time: {
    required: true,
    type: String,
  },
  Content: {
    required: true,
    type: String,
  },
  From: {
    required: true,
    type: String,
  },
  To: {
    required: true,
    type: String,
  },
});

const pvtData = mongoose.model("pvtData", messageSchema);

module.exports = pvtData;
