const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  niche: {
    type: String,
    required: true,
  },
  reelIdea: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  hashtags: [
    {
      type: String,
    },
  ],
  hook: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Content", contentSchema);
