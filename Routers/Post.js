const router = require("express").Router();
const Post = require("../Models/Post");

router.post("/", async (req, res) => {
  try {
    const { title, body, imgUrl, readtime, tags } = req.body;

    const tagsArr = strToTagsArr(tags + " ");
    const post = await Post.create({
      title,
      body,
      imgUrl,
      readtime,
      tags: tagsArr,
    });
    res.json("Successfully created!");
  } catch (err) {
    res.status(409).send(err.message);
  }
});

module.exports = router;

function strToTagsArr(tags) {
  const tagsArr = [];
  let start = null,
    end = null;
  for (let i = 0; i < tags.length; i++) {
    if (tags[i] === "#") {
      start = i;
    } else if (tags[i] === " " && start !== null) {
      end = i;
    }
    if (start !== null && end !== null) {
      tagsArr.push(tags.slice(start + 1, end));
      (start = null), (end = null);
    }
  }
  return tagsArr;
}
