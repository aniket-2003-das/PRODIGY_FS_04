// Importing required modules
const appError = require(`${__dirname}/../utils/appError.js`); // Error handling utility
const Users = require(`${__dirname}/../Models/userModel.js`); // User model
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`); // Async error handler

// Function to send a friend request
exports.sendRequest = catchAsync(async (req, res, next) => {
  // Finding the user based on the provided email
  const result = await Users.findOne({
    userEmail: req.body.userEmail,
  });

  // If user doesn't exist, return an error
  if (!result) {
    return new appError("UserName doesn't exists", 404);
  } else {
    // If the request is already sent, return success message
    var newArr = result.pendingRequests;
    if (newArr.includes(req.user.userName)) {
      res.status(200).json({
        status: "success",
        message: "Request was sent Succesfully! no need to send again",
      });
      return;
    }
    // Add sender's username to receiver's pending requests
    newArr.push(req.user.userName);

    // Update receiver's pending requests
    await Users.updateOne(
      { userEmail: req.body.userEmail },
      {
        $set: {
          pendingRequests: newArr,
        },
      }
    );

    // Return success message
    res.status(200).json({
      status: "success",
      message: "Request has been sent Succesfully",
    });
  }
});

// Function to get friend requests of a user
exports.getFriendRequests = catchAsync(async (req, res, next) => {
  // Return user's pending friend requests
  res.status(200).json({
    status: "success",
    user: req.user.pendingRequests,
  });
});

// Function to get list of friends of a user
exports.getListOfFriends = catchAsync(async (req, res, next) => {
  // Return user's list of friends
  res.status(200).json({
    status: "success",
    user: req.user.listOfFriends,
  });
});

// Function to add a friend
exports.addAFriend = catchAsync(async (req, res, next) => {
  // Add requester to receiver's list of friends
  await Users.updateOne(
    { userName: req.body.requestName },
    {
      $addToSet: {
        listOfFriends: req.user.userName,
      },
    }
  );

  // Add receiver to requester's list of friends
  await Users.updateOne(
    { userEmail: req.user.userEmail },
    {
      $addToSet: {
        listOfFriends: req.body.requestName,
      },
    }
  );

  // Remove friend request from receiver's pending requests
  await Users.updateOne(
    { userEmail: req.user.userEmail },
    {
      $pull: {
        pendingRequests: req.body.requestName,
      },
    }
  );

  // Return success message
  res.status(200).json({
    status: "success",
  });
});

// Function to delete a friend
exports.deleteAFriend = catchAsync(async (req, res, next) => {
  // Remove friend request from user's pending requests
  var newArr = req.user.pendingRequests;
  const index = newArr.indexOf(req.body.requestName);
  const x = newArr.splice(index, 1);
  await Users.updateOne(
    { userEmail: req.user.userEmail },
    {
      $set: {
        pendingRequests: newArr,
      },
    }
  );

  // Return success message
  res.status(200).json({
    status: "success",
  });
});
