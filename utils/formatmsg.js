const moment_timezone = require("moment-timezone");

const xyz = (username, message) => {
  return {
    username,
    message,
    time: moment_timezone()
      .tz("Asia/Kolkata")
      .format("MMMM Do YYYY, h:mm:ss a"),
  };
};
module.exports = xyz;
