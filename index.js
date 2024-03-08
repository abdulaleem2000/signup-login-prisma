const cookieParser = require("cookie-parser");
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Use CORS middleware
app.use(cors());

//user router
const userRouter = require("./routes/userRoutes");
app.use("/api", userRouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => console.log("server is listening on port 3000!"));
