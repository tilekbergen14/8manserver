const mongoose = require("mongoose");

const Post = mongoose.model(
  "Post",
  mongoose.Schema(
    {
      title: {
        type: String,
        trim: true,
      },
      body: {
        type: Object,
      },
      imgUrl: { type: String },
      readtime: { type: String, trim: true },
      tags: [String],
    },
    { timestamps: true }
  )
);

module.exports = Post;
