const express = require("express");
const router = express.Router();
const Analytics = require("../models/Analytics");
const auth = require("../middleware/auth");

// Get analytics data
router.get("/", auth, async (req, res) => {
  try {
    let analytics = await Analytics.findOne({ user: req.user.userId });

    if (!analytics) {
      // Create mock data if none exists
      analytics = new Analytics({
        user: req.user.userId,
        followers: Array.from({ length: 7 }, (_, i) => ({
          count: 1200 + i * 50,
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
        })),
        engagement: Array.from({ length: 5 }, (_, i) => ({
          post: i + 1,
          likes: Math.floor(Math.random() * 200) + 200,
          comments: Math.floor(Math.random() * 30) + 10,
          date: new Date(Date.now() - (4 - i) * 24 * 60 * 60 * 1000),
        })),
        bestPostTime: {
          day: "Wednesday",
          time: "7 PM",
        },
      });
      await analytics.save();
    }

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

// Update analytics data
router.post("/update", auth, async (req, res) => {
  try {
    const { followers, engagement, bestPostTime } = req.body;

    let analytics = await Analytics.findOne({ user: req.user.userId });

    if (!analytics) {
      analytics = new Analytics({
        user: req.user.userId,
        followers,
        engagement,
        bestPostTime,
      });
    } else {
      analytics.followers = followers;
      analytics.engagement = engagement;
      analytics.bestPostTime = bestPostTime;
    }

    await analytics.save();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: "Error updating analytics" });
  }
});

module.exports = router;
