require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(require("cors")());
app.use("/", require("./Users/Router"));

app.listen(
  5000,
  mongoose
    .connect(
      `mongodb+srv://tiqu:${process.env.MONGODB_PASS}@8manserver.iotaa.mongodb.net/8man?retryWrites=true&w=majority`
    )
    .then(() => console.log("Successfully connected to the Database"))
    .catch((err) => console.log(err))
);
