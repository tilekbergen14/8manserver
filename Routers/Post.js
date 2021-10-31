const router = require("express").Router();
const Post = require("../Models/Post");
const User = require("../Models/User");
const authentication = require("../Middlewares/Authenticaiton");

router.post("/", authentication, async (req, res) => {
  try {
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
    console.log(err);
    res.status(409).send(err.message);
  }
});

router.post("/like", authentication, async (req, res) => {
  try {
    const postId = req.body.id;
    const _id = req.user.id;
    const post = await Post.findById(postId);
    const liked = post.likes.includes(_id);
    if (liked) {
      post.likes = post.likes.filter(
        (like) => JSON.stringify(like) !== JSON.stringify(_id)
      );
    } else {
      post.likes.push(_id);
    }
    await Post.findByIdAndUpdate(postId, post, {
      new: true,
    });
    res.status(200).send("reacted");
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
          const userLiked = post.likes.includes(user._id);
          if (user)
            return {
              id: post._id,
              title: post.title,
              tags: post.tags,
              createdAt: post.createdAt,
              readtime: post.readtime,
              likes: post.likes.length,
              userLiked: userLiked,
              ...userInfo,
            };
        }
      } catch (err) {
        res.status(500).json("Something went wrong");
      }
    })
  );
  res.json(newposts);
});

router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    let post = await Post.findById(postId);
    if (!post) res.status(404).json("Bad request");
    const user = await User.findById(post.author_id);
    const userLiked = post.likes.includes(user._id);
    post = {
      id: post._id,
      title: post.title,
      tags: post.tags,
      createdAt: post.createdAt,
      likes: post.likes.length,
      userLiked: userLiked,
      author_id: user._id,
      author: user.username,
      imgUrl: post.imgUrl,
      body: post.body,
    };
    res.json(post);
  } catch (err) {
    res.status(500).json("Something went wrong!");
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
