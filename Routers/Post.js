const router = require("express").Router();
const Post = require("../Models/Post");
const User = require("../Models/User");
const authentication = require("../Middlewares/Authenticaiton");

router.post("/", authentication, async (req, res) => {
  try {
    console.log("start");
    const { title, body, imgUrl, readtime, tags } = req.body;
    const user = req.user;
    if (!user) return res.status(409).json("Bad request");
    const tagsArr = strToTagsArr(tags + " ");
    const post = await Post.create({
      title,
      body,
      imgUrl,
      readtime,
      tags: tagsArr,
      author_id: user.id,
    });

    res.json("Successfully created!");
  } catch (err) {
    res.status(409).send(err.message);
  }
});

router.get("/", async (req, res) => {
  const posts = await Post.find({});
  const newposts = await Promise.all(
    posts.map(async (post) => {
      try {
        if (post.author_id) {
          const user = await User.findById(post.author_id);
          const userInfo = {
            author_id: user._id,
            author: user.username,
            authorProfile: user.profileImg,
          };
          if (user) return { ...post._doc, ...userInfo };
        }
      } catch (err) {
        res.status(500).json("Something went wrong");
      }
    })
  );
  res.json(newposts);
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
