const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    let user = null;
    const userEmail = await User.findOne({ email: toString(emailOrUsername) });
    const userName = await User.findOne({
      username: emailOrUsername,
    });
    if (userEmail) {
      user = userEmail;
    }
    if (userName) {
      user = userName;
    }
    if (!user) return res.status(403).send("Couldnt find user!");
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) return res.status(403).send("Wrong password!");
    const token = await jwt.sign(
      { username: user.username, password: user.password },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ username: user.username, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password, password2 } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(403).send("This email is already used!");
    if (await User.findOne({ username }))
      return res.status(403).send("This username is already used!");
    if (password !== password2)
      return res.status(403).send("Passwords doesn't match!");
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    const token = await jwt.sign(
      { username: user.username, password: user.password },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ username: user.username, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

function authenticateToken(req, res, next) {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (!token) return res.status(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.status(403);
    console.log(user);
    req.user = user;
    next();
  });
}

module.exports = router;
