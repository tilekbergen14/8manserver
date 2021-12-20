const router = require("express").Router();
const Lesson = require("../Models/Lesson");
const User = require("../Models/User");
const authorization = require("../middlewares/Authenticaiton");

router.post("/", authorization, async (req, res) => {
  try {
    let user = req.user;
    if (!user) return res.status(409).json("Bad request");
    user = await User.findById(user.id);
    if (!user) return res.status(409).json("Bad request");
    if (!user.isAdmin) return res.status(409).json("Bad request");
    const lesson = await Lesson.create({
      ...req.body,
      author_id: user._id,
    });

    res.json("Successfully created!");
  } catch (err) {
    res.status(409).send(err.message);
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find({});
    res.json(lessons);
  } catch (err) {
    res.status(409).send(err.message);
    console.log(err.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Lesson.findByIdAndUpdate(id, req.body, { new: true });
    result && res.json("updated");
  } catch (err) {
    res.status(500).json("Something went wrong!");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Lesson.findByIdAndDelete(id);
    result && res.json("deleted");
  } catch (err) {
    res.status(500).json("Something went wrong!");
  }
});

module.exports = router;
