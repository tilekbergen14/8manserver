const router = require("express").Router();
const Answer = require("../Models/Answer");
const authorization = require("../middlewares/Authenticaiton");

router.post("/", authorization, async (req, res) => {
  try {
    const user = req.user;
    const { body, question_id } = req.body;
    const answer = await Answer.create({
      body,
      author_id: user.id,
      question_id,
    });
    if (answer) res.json("Successfully created");
  } catch (err) {
    res.status(500).json("Something went wrong!");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Answer.findByIdAndDelete(id);
    result && res.json("deleted");
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong!");
  }
});

router.post("/like", authorization, async (req, res) => {
  try {
    const answerId = req.body.id;
    const _id = req.user.id;
    const answer = await Answer.findById(answerId);
    const liked = answer.likes.includes(_id);
    if (liked) {
      answer.likes = answer.likes.filter(
        (like) => JSON.stringify(like) !== JSON.stringify(_id)
      );
    } else {
      answer.likes.push(_id);
    }
    await Answer.findByIdAndUpdate(answerId, answer, {
      new: true,
    });
    res.status(200).send("reacted");
  } catch (err) {
    res.status(409).send(err.message);
  }
});

module.exports = router;
