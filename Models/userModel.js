const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "A user must have a username"],
  },
  userEmail: {
    type: String,
    required: [true, "A user must have an email"],
    validate: [validator.isEmail, "Email provided is not valid"],
    lowercase: true,
  },
  listOfFriends: [String],
  pendingRequests: [String],
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    minlength: 8,
    required: [true, "Please confirm password"],
    validate: {
      validator: function (ele) {
        return ele === this.password;
      },
      message: "Password doesn't match",
    },
  },
  verified: Boolean,
});

userSchema.pre("save", async function (next) {
  // this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
