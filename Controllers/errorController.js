const AppError = require("./../utils/appError");

// Function to send detailed error response in development environment
const sendErrorDev = (err, res) => {
  // Send error status, message, and stack trace in response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    // err, // You can choose to include the full error object for debugging
  });
};

// Function to handle validation errors
const handleValidationError = (err) => {
  // Extract error message from the first validation error
  const message = Object.values(err.errors)[0].message;
  // Create a new AppError instance with the extracted message and 400 status code
  return new AppError(message, 400);
};

// Function to handle cast errors
const handleCastError = (err) => {
  // Construct an error message indicating the invalid path and value
  const message = `invalid ${err5.path} : ${err.value}`;
  // Create a new AppError instance with the constructed message and 400 status code
  return new AppError(message, 400);
};

// Error handling middleware
exports.errorHandler = (err, req, res, next) => {
  // Check if the error is a validation error and handle it
  if (err.name == "ValidationError") err = handleValidationError(err);
  // Check if the error is a cast error and handle it
  if (err.name == "CastError") err = handleCastError(err);
  // Set default status code and status message if not already defined
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "undefined error";
  // Send error response
  sendErrorDev(err, res);
};
