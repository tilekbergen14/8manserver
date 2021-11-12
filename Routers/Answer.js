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

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  res.json("deleted");
});

module.exports = router;
