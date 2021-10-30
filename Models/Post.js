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
      author_id: { type: mongoose.ObjectId, required: true },
    },
    { timestamps: true }
  )
);

module.exports = Post;
