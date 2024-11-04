const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: [true, "A room must have a room name"],
  },
  roomCode: {
    type: Number,
  },
});

roomSchema.pre("save", async function (next) {
  this.roomCode = Math.floor(Math.random() * 1000000);
  next();
});
const Rooms = mongoose.model("Room", roomSchema);
module.exports = Rooms;
