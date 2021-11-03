const mongoose = require("mongoose");

const Answer = mongoose.model(
  "Answer",
  mongoose.Schema(
    {
      body: {
        type: Map,
        required: true,
      },
      author_id: { type: mongoose.ObjectId, required: true },
      likes: [mongoose.ObjectId],
    },
    { timestamps: true }
  )
);

module.exports = Answer;
