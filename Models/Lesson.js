const mongoose = require("mongoose");

const Lesson = mongoose.model(
  "Lesson",
  mongoose.Schema(
    {
      title: {
        type: String,
        trim: true,
        require,
      },
      price: {
        type: Number,
        require,
      },
      imgUrl: { type: String },
      author_id: { type: mongoose.ObjectId, required: true },
      series: [mongoose.ObjectId],
      published: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);

module.exports = Lesson;
