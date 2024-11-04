// Import required modules
const Users = require(`${__dirname}/../Models/userModel.js`);
const usersVerification = require(`${__dirname}/../Models/userVerificationModel.js`);
const appError = require(`${__dirname}/../utils/appError.js`);
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`);
const sendEmail = require(`${__dirname}/../utils/sendEmail.js`);
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const path = require("path");

// Function to sign JWT token
const sign = (id) => {
  return JWT.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Function to create and send JWT token as a cookie
const createSendToken = (user, res) => {
  const token = sign(user._id);
  const cookieOptions = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  res.status(200).json({
    status: "success",
    user,
    token,
  });
};

// Controller function to get a user by ID
exports.getAUser = catchAsync(async (req, res, next) => {
  const cuser = await Users.find({ _id: req.params.id });
  res.status(200).json({
    status: "Success",
    cuser,
  });
});

// Controller function to handle email verification
exports.verify = catchAsync(async (req, res, next) => {
  let { userId, uniqueString } = req.params;
  const cuser = await usersVerification.find({ userId });
  if (
    cuser.length > 0 &&
    cuser[0].expiresAt > Date.now() &&
    (await bcrypt.compare(uniqueString, cuser[0].uniqueString))
  ) {
    await Users.updateOne({ _id: userId }, { verified: true });
    await usersVerification.deleteOne({ userId });
    res.sendFile(path.join(__dirname, "..", "public", "email-verified.html"));
  } else {
    await Users.deleteOne({ _id: userId });
    res.status(400).json({
      Status: "Verification Failed",
    });
  }
});

// Controller function to handle user signup
exports.signup = catchAsync(async (req, res, next) => {
  // Check if the email is already registered and verified
  const check1 = await Users.find({
    $and: [{ userEmail: req.body.userEmail }, { verified: true }],
  });
  if (check1.length > 0)
    return next(new appError("This email is already registered", 400));

  // Check if the email is already registered but not verified
  const check2 = await Users.find({ userEmail: req.body.userEmail });
  if (check2.length > 0) {
    await Users.deleteOne({ userEmail: req.body.userEmail });
  }

  // Check if the username already exists
  const check3 = await Users.find({ userName: req.body.userName });
  if (check3.length > 0)
    return next(new appError("This userName already exist", 400));

  // Create a new user
  const newUser = await Users.create({
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    verified: false,
  });
  try {
    // Send verification email to the new user
    await sendVerificationEmail(newUser, req, res);
    res.status(201).json({
      Status: "Pending",
      Message: "Verification email has been sent",
      newUser,
    });
  } catch (err) {
    // Delete the newly created user if sending email fails
    await Users.deleteOne({ _id: newUser._id });
  }
});

// Function to send verification email to a new user
const sendVerificationEmail = async (newUser, req, res) => {
  // Check if there are any existing verification records for the user
  const check1 = await usersVerification.find({ userName: newUser.userName });
  if (check1) {
    // If found, delete them
    await usersVerification.deleteOne({ userName: newUser.userName });
  }
  // Construct the current URL
  const currentUrl = `${req.protocol}://${req.get("host")}/`;
  // Generate a unique verification string
  const uniqueString = uuidv4();
  const hashedString = await bcrypt.hash(uniqueString, 10);
  // Create a new verification record with a unique string
  const newToken = await usersVerification.create({
    userId: newUser._id,
    userName: newUser.userName,
    uniqueString: hashedString,
    createdAt: Date.now(),
    expiresAt: Date.now() + 21600000, // Expires after 6 hours
  });
  try {
    // Send verification email containing the unique verification URL
    await sendEmail({
      to: newUser.userEmail,
      subject: "Verify Your Email",
      text: `Open this to verify. ${
        currentUrl + "users/verify/" + newUser._id + "/" + uniqueString
      }`,
    });
  } catch (err) {
    console.log(err);
  }
};

// Controller function to handle user login
exports.login = catchAsync(async (req, res, next) => {
  const { userEmail, password } = req.body;
  // Check if email and password are provided
  if (!userEmail || !password) {
    return next(new appError("Please provide email and password", 400));
  }

  // Find the user by email
  const cuser = await Users.findOne({ userEmail });
  // If user not found, return error
  if (!cuser) {
    return next(
      new appError(
        "The provided email doesn't exist in the database. Please sign up first.",
        400
      )
    );
  }

  // Check if the user is verified
  if (!cuser.verified) {
    return next(new appError("Please verify your email first", 400));
  }

  // Compare passwords
  // if (!(await bcrypt.compare(password, cuser.password))) {
  //   return next(new appError("Incorrect password", 400));
  // }
  if (password != cuser.password) {
    return next(new appError("Incorrect password", 400));
  }

  // If everything is correct, create and send JWT token
  createSendToken(cuser, res);
});

// Middleware to protect routes requiring authentication
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  // Check if token exists
  if (!token) {
    return next(
      new appError("You are not logged in. Please log in first!", 401)
    );
  }
  // Verify the token
  const decoded = JWT.verify(token, process.env.JWT_SECRET);
  // Find the current user
  const currentUser = await Users.findById(decoded.id);
  // If user not found, return error
  if (!currentUser) {
    return next(
      new appError("The user belonging to this token does not exist.", 401)
    );
  }
  // Set the user data in the request object
  req.user = currentUser;
  next();
});

// Controller function to handle user logout
exports.logout = catchAsync(async (req, res, next) => {
  // Clear the JWT cookie
  res.cookie("jwt", "");
  // Send success response
  res.status(204).json({
    status: "success",
  });
});
