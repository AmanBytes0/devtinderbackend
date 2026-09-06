const express = require("express");
require("dotenv").config();

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const http = require("http");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const request = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const { initializeSocket } = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", request);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(process.env.PORT, () => {
      console.log(`Server started listening at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Cannot connect to the database", error);
  });
