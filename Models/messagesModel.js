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
  Room: {
    required: true,
    type: String,
  },
});

const Data = mongoose.model("Data", messageSchema);

module.exports = Data;