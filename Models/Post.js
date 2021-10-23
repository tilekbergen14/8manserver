const mongoose = require("mongoose");

const Post = mongoose.model(
  "Post",
  mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "title is required!"],
        trim: true,
      },
      description: {
        type: String,
        required: [true, "email is required!"],
      },
      imgUrl: { type: String },
      readtime: { type: String },
      tags: [String],
    },
    { timestamps: true }
  )
);

module.exports = Post;
