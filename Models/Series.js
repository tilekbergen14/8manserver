const mongoose = require("mongoose");

const Serie = mongoose.model(
  "Serie",
  mongoose.Schema(
    {
      title: {
        type: String,
        trim: true,
        require,
      },
      videoUrl: { type: String },
      body: { type: Map },
      lesson_id: { type: mongoose.ObjectId, require },
    },
    { timestamps: true }
  )
);

module.exports = Serie;
