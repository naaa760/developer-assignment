const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  niche: {
    type: String,
    required: true,
    enum: [
      "fashion",
      "fitness",
      "finance",
      "lifestyle",
      "technology",
      "food",
      "travel",
      "beauty",
      "education",
      "entertainment",
    ],
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
      required: true,
    },
  ],
  hook: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    default: "anonymous", // For Clerk user ID when authentication is implemented
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
ContentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Add text index for search functionality
ContentSchema.index({
  topic: "text",
  niche: "text",
  reelIdea: "text",
  caption: "text",
});

module.exports = mongoose.model("Content", ContentSchema);
