const router = require("express").Router();
const Lesson = require("../Models/Lesson");
const User = require("../Models/User");
const authorization = require("../middlewares/Authenticaiton");
const Block = require("../Models/Block");
const Serie = require("../Models/Series");

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
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const lesson = await Lesson.findById(id);
    if (!lesson) res.status(404).json("Couldn't find lesson!");
    const blocks = await Promise.all(
      lesson.blocks.map(async (id) => {
        try {
          const block = await Block.findById(id);
          const series = await Promise.all(
            block.series.map(async (id) => {
              try {
                const serie = await Serie.findById(id);
                return serie;
              } catch (err) {
                res.status(500).json("Something went wrong");
              }
            })
          );
          return { _id: block._id, title: block.title, series };
        } catch (err) {
          res.status(500).json("Something went wrong");
        }
      })
    );
    res.json({
      _id: lesson._id,
      title: lesson.title,
      blocks,
      price: lesson.price,
    });
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