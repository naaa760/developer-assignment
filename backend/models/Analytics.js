const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followers: [
    {
      count: Number,
      date: Date,
    },
  ],
  engagement: [
    {
      post: Number,
      likes: Number,
      comments: Number,
      date: Date,
    },
  ],
  bestPostTime: {
    day: String,
    time: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
