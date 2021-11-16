const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authorization = require("../Middlewares/Authenticaiton");

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.json({
      username: user.username,
      profile: user.profileImg,
      id: user._id,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json("Something went wrog");
  }
});
router.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    let user = null;
    const userEmail = await User.findOne({ email: emailOrUsername });
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
      {
        username: user.username,
        password: user.password,
        id: user._id,
      },
      process.env.JWT_SECRET
    );
    res.json({
      username: user.username,
      token,
      role: user.isAdmin ? "admin" : "user",
      imgUrl: user.imgUrl,
      id: user._id,
    });
  } catch (error) {
    res.status(500).send("Something went wrong!");
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
      { username: user.username, password: user.password, id: user._id },
      process.env.JWT_SECRET
    );
    res.json({
      username: user.username,
      token,
      role: user.isAdmin ? "admin" : "user",
      imgUrl: user.imgUrl,
      id: user._id,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/", authorization, async (req, res) => {
  try {
    const info = req.body;
    const user = req.user;
    const result = await User.findByIdAndUpdate(user.id, info, { new: true });
    result && res.json("updated");
  } catch (err) {
    res.status(500).json("Something went wrong!");
  }
});

module.exports = router;
