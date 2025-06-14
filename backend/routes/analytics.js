const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Get analytics data
router.get("/", auth, async (req, res) => {
  try {
    // Initialize global analytics if not exists
    if (!global.analytics) {
      global.analytics = [];
    }

    // Check if user already has analytics data
    let userAnalytics = global.analytics.find(
      (a) => a.user === req.user.userId
    );

    if (!userAnalytics) {
      // Create mock data if none exists
      userAnalytics = {
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
        lastUpdated: new Date(),
      };

      global.analytics.push(userAnalytics);
    }

    res.json(userAnalytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

// Update analytics data
router.post("/update", auth, async (req, res) => {
  try {
    const { followers, engagement, bestPostTime } = req.body;

    if (!global.analytics) {
      global.analytics = [];
    }

    let userAnalyticsIndex = global.analytics.findIndex(
      (a) => a.user === req.user.userId
    );

    if (userAnalyticsIndex === -1) {
      // Create new analytics entry
      const newAnalytics = {
        user: req.user.userId,
        followers,
        engagement,
        bestPostTime,
        lastUpdated: new Date(),
      };
      global.analytics.push(newAnalytics);
      res.json(newAnalytics);
    } else {
      // Update existing analytics
      global.analytics[userAnalyticsIndex] = {
        ...global.analytics[userAnalyticsIndex],
        followers,
        engagement,
        bestPostTime,
        lastUpdated: new Date(),
      };
      res.json(global.analytics[userAnalyticsIndex]);
    }
  } catch (error) {
    console.error("Error updating analytics:", error);
    res.status(500).json({ message: "Error updating analytics" });
  }
});

module.exports = router;
