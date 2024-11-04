const express = require("express");
const http = require(`http`);
const path = require(`path`);
const userRouter = require(`${__dirname}/Routes/userRoutes.js`);
const roomRouter = require(`${__dirname}/Routes/roomRoutes.js`);
const mixedRouter = require(`${__dirname}/Routes/mixedRoutes.js`);
const errorFunction = require(`${__dirname}/Controllers/errorController.js`);
const cookieParser = require("cookie-parser");
const userFunctions = require("./Controllers/userControllers");
const app = express();
const server = http.createServer(app);

// setting static folder
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", userRouter);
app.use("/room", roomRouter);
app.use("/mixed", mixedRouter);

app.get("/home", userFunctions.protect, (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});
app.use("/chat", userFunctions.protect, (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"));
});
app.use("/pvtmsg", userFunctions.protect, (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "pvtmsg.html"));
});

app.use("/signup", (req, res, next) => {
  res.sendFile(`${__dirname}/public/index.html`);
});
app.use("/login", (req, res, next) => {
  res.sendFile(`${__dirname}/public/login.html`);
});
app.use("/verifyfirst", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "verifyfirst.html"));
});

app.use(errorFunction.errorHandler);
module.exports = {
  app,
  server,
};
