const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: "anonymous",
    index: true,
  },
  followers: [
    {
      type: Number,
      required: true,
    },
  ],
  engagement: [
    {
      post: {
        type: Number,
        required: true,
      },
      likes: {
        type: Number,
        required: true,
      },
      comments: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  bestPostTime: {
    type: String,
    required: true,
    default: "Wednesday 7 PM",
  },
  period: {
    type: String,
    required: true,
    enum: ["7days", "30days", "90days"],
    default: "7days",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
AnalyticsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get default analytics data
AnalyticsSchema.statics.getDefaultData = function () {
  return {
    followers: [1200, 1250, 1280, 1295, 1330, 1360, 1400],
    engagement: [
      {
        post: 1,
        likes: 320,
        comments: 25,
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        post: 2,
        likes: 400,
        comments: 40,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        post: 3,
        likes: 290,
        comments: 10,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        post: 4,
        likes: 380,
        comments: 35,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        post: 5,
        likes: 450,
        comments: 50,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
    bestPostTime: "Wednesday 7 PM",
    period: "7days",
  };
};

module.exports = mongoose.model("Analytics", AnalyticsSchema);
