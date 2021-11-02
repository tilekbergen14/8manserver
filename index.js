require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(require("cors")());
app.use("/user", require("./Routers/User"));
app.use("/image", require("./Routers/Image"));
app.use("/image", express.static("image"));
app.use("/post", require("./Routers/Post"));
app.use("/question", require("./Routers/Question"));

app.listen(
  5000,
  mongoose
    .connect(
      `mongodb+srv://tiqu:${process.env.MONGODB_PASS}@8manserver.iotaa.mongodb.net/8man?retryWrites=true&w=majority`
    )
    .then(() => console.log("Successfully connected to the Database"))
    .catch((err) => console.log(err))
);
