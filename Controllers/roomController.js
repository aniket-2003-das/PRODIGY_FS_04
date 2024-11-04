// Importing required modules
const Room = require(`${__dirname}/../Models/roomModel.js`); // Room model
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`); // Async error handler
const appError = require(`${__dirname}/../utils/appError.js`); // Error handling utility

// Function to create a new room
exports.createRoom = catchAsync(async (req, res, next) => {
  // Create a new room with the provided room name
  const newRoom = await Room.create({
    roomName: req.body.roomName,
  });

  // Send success response with the newly created room
  res.status(201).json({
    status: "Success",
    newRoom,
  });
});

// Function to get details of a room
exports.getRoom = catchAsync(async (req, res, next) => {
  // Find the room based on the provided room code
  const currentRoom = await Room.findOne({
    roomCode: req.body.roomCode,
  });

  // If room doesn't exist, return an error
  if (!currentRoom) {
    return next(new appError("No Such Room Exist", 404));
  }

  // Send success response with the details of the found room
  res.status(201).json({
    status: "Success",
    currentRoom,
  });
});
