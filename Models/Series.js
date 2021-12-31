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
      body: { type: Map },
    },
    { timestamps: false }
  )
);

module.exports = Serie;
