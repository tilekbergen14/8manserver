const router = require("express").Router();
const Post = require("../Models/Post");

router.post("/", async (req, res) => {
  try {
    const post = await Post.create(req.body);
    console.log(post);
    res.json("Successfully created!");
  } catch (err) {
    console.log(err.message);
    res.status(409).send(err.message);
  }
});

module.exports = router;
