const express = require("express");
const Analytics = require("../models/Analytics");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Get analytics data
router.get("/", requireAuth, async (req, res) => {
  try {
    const { period = "7days" } = req.query;
    const userId = req.auth.userId; // Get user ID from Clerk auth

    // Try to find existing analytics for user
    let analytics = await Analytics.findOne({ userId, period });

    // If no analytics found, create default data
    if (!analytics) {
      const defaultData = Analytics.getDefaultData();
      analytics = new Analytics({
        userId,
        period,
        ...defaultData,
      });
      await analytics.save();
    }

    // Calculate additional metrics
    const totalLikes = analytics.engagement.reduce(
      (sum, post) => sum + post.likes,
      0
    );
    const totalComments = analytics.engagement.reduce(
      (sum, post) => sum + post.comments,
      0
    );
    const totalEngagement = totalLikes + totalComments;
    const avgEngagementPerPost = totalEngagement / analytics.engagement.length;
    const currentFollowers =
      analytics.followers[analytics.followers.length - 1];
    const previousFollowers = analytics.followers[0];
    const followerGrowth = currentFollowers - previousFollowers;
    const followerGrowthPercentage = (
      (followerGrowth / previousFollowers) *
      100
    ).toFixed(2);

    res.json({
      success: true,
      data: {
        id: analytics._id,
        followers: analytics.followers,
        engagement: analytics.engagement,
        bestPostTime: analytics.bestPostTime,
        period: analytics.period,
        metrics: {
          totalLikes,
          totalComments,
          totalEngagement,
          avgEngagementPerPost: Math.round(avgEngagementPerPost),
          currentFollowers,
          followerGrowth,
          followerGrowthPercentage: parseFloat(followerGrowthPercentage),
          engagementRate: (
            (totalEngagement /
              (currentFollowers * analytics.engagement.length)) *
            100
          ).toFixed(2),
        },
        createdAt: analytics.createdAt,
        updatedAt: analytics.updatedAt,
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch analytics",
      message: error.message,
    });
  }
});

// Upload new analytics data
router.post("/upload", requireAuth, async (req, res) => {
  try {
    const { followers, engagement, bestPostTime, period = "7days" } = req.body;
    const userId = req.auth.userId; // Get user ID from Clerk auth

    // Validation
    if (!followers || !engagement) {
      return res.status(400).json({
        error: "Followers and engagement data are required",
      });
    }

    if (!Array.isArray(followers) || !Array.isArray(engagement)) {
      return res.status(400).json({
        error: "Followers and engagement must be arrays",
      });
    }

    // Validate engagement data structure
    const isValidEngagement = engagement.every(
      (post) =>
        typeof post.post === "number" &&
        typeof post.likes === "number" &&
        typeof post.comments === "number"
    );

    if (!isValidEngagement) {
      return res.status(400).json({
        error: "Invalid engagement data structure",
      });
    }

    // Update or create analytics
    let analytics = await Analytics.findOne({ userId, period });

    if (analytics) {
      analytics.followers = followers;
      analytics.engagement = engagement.map((post) => ({
        ...post,
        date: post.date ? new Date(post.date) : new Date(),
      }));
      analytics.bestPostTime = bestPostTime || analytics.bestPostTime;
      analytics.updatedAt = new Date();
    } else {
      analytics = new Analytics({
        userId,
        followers,
        engagement: engagement.map((post) => ({
          ...post,
          date: post.date ? new Date(post.date) : new Date(),
        })),
        bestPostTime: bestPostTime || "Wednesday 7 PM",
        period,
      });
    }

    await analytics.save();

    res.json({
      success: true,
      message: "Analytics data uploaded successfully",
      data: {
        id: analytics._id,
        followers: analytics.followers,
        engagement: analytics.engagement,
        bestPostTime: analytics.bestPostTime,
        period: analytics.period,
        updatedAt: analytics.updatedAt,
      },
    });
  } catch (error) {
    console.error("Analytics upload error:", error);
    res.status(500).json({
      error: "Failed to upload analytics",
      message: error.message,
    });
  }
});

// Generate sample data for testing
router.post("/generate-sample", requireAuth, async (req, res) => {
  try {
    const { period = "7days" } = req.body;
    const userId = req.auth.userId; // Get user ID from Clerk auth

    // Generate random but realistic data
    const generateFollowers = (days = 7) => {
      const followers = [];
      let current = 1000 + Math.floor(Math.random() * 500); // Start between 1000-1500
      for (let i = 0; i < days; i++) {
        followers.push(current);
        current += Math.floor(Math.random() * 50) + 10; // Grow by 10-60 each day
      }
      return followers;
    };

    const generateEngagement = (posts = 5) => {
      const engagement = [];
      for (let i = 1; i <= posts; i++) {
        engagement.push({
          post: i,
          likes: Math.floor(Math.random() * 300) + 100, // 100-400 likes
          comments: Math.floor(Math.random() * 50) + 5, // 5-55 comments
          date: new Date(Date.now() - (posts - i) * 24 * 60 * 60 * 1000), // Spread over last 5 days
        });
      }
      return engagement;
    };

    const bestPostTimes = [
      "Monday 6 PM",
      "Tuesday 7 PM",
      "Wednesday 7 PM",
      "Thursday 8 PM",
      "Friday 6 PM",
      "Saturday 5 PM",
      "Sunday 4 PM",
    ];

    const analytics = new Analytics({
      userId,
      followers: generateFollowers(period === "30days" ? 30 : 7),
      engagement: generateEngagement(5),
      bestPostTime:
        bestPostTimes[Math.floor(Math.random() * bestPostTimes.length)],
      period,
    });

    await analytics.save();

    res.json({
      success: true,
      message: "Sample analytics data generated successfully",
      data: {
        id: analytics._id,
        followers: analytics.followers,
        engagement: analytics.engagement,
        bestPostTime: analytics.bestPostTime,
        period: analytics.period,
      },
    });
  } catch (error) {
    console.error("Sample generation error:", error);
    res.status(500).json({
      error: "Failed to generate sample data",
      message: error.message,
    });
  }
});

// Export analytics report
router.get("/export", async (req, res) => {
  try {
    const {
      userId = "anonymous",
      period = "7days",
      format = "json",
    } = req.query;

    const analytics = await Analytics.findOne({ userId, period });

    if (!analytics) {
      return res.status(404).json({
        error: "Analytics data not found",
      });
    }

    // Calculate metrics for the report
    const totalLikes = analytics.engagement.reduce(
      (sum, post) => sum + post.likes,
      0
    );
    const totalComments = analytics.engagement.reduce(
      (sum, post) => sum + post.comments,
      0
    );
    const totalEngagement = totalLikes + totalComments;
    const currentFollowers =
      analytics.followers[analytics.followers.length - 1];
    const previousFollowers = analytics.followers[0];
    const followerGrowth = currentFollowers - previousFollowers;

    const reportData = {
      reportGenerated: new Date().toISOString(),
      period: analytics.period,
      userId: analytics.userId,
      summary: {
        currentFollowers,
        followerGrowth,
        followerGrowthPercentage: parseFloat(
          ((followerGrowth / previousFollowers) * 100).toFixed(2)
        ),
        totalPosts: analytics.engagement.length,
        totalLikes,
        totalComments,
        totalEngagement,
        avgEngagementPerPost: Math.round(
          totalEngagement / analytics.engagement.length
        ),
        engagementRate: parseFloat(
          (
            (totalEngagement /
              (currentFollowers * analytics.engagement.length)) *
            100
          ).toFixed(2)
        ),
        bestPostTime: analytics.bestPostTime,
      },
      data: {
        followers: analytics.followers,
        engagement: analytics.engagement,
      },
      insights: [
        `Your follower count grew by ${followerGrowth} followers (${(
          (followerGrowth / previousFollowers) *
          100
        ).toFixed(1)}%)`,
        `Your average engagement per post is ${Math.round(
          totalEngagement / analytics.engagement.length
        )} interactions`,
        `Your best performing post had ${Math.max(
          ...analytics.engagement.map((p) => p.likes + p.comments)
        )} total interactions`,
        `Your engagement rate is ${(
          (totalEngagement / (currentFollowers * analytics.engagement.length)) *
          100
        ).toFixed(2)}%`,
        `Best time to post: ${analytics.bestPostTime}`,
      ],
    };

    if (format === "json") {
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="analytics-report-${period}.json"`
      );
      res.json(reportData);
    } else {
      // Return as downloadable JSON for now
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="analytics-report-${period}.json"`
      );
      res.json(reportData);
    }
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({
      error: "Failed to export analytics",
      message: error.message,
    });
  }
});

// Delete analytics data
router.delete("/", async (req, res) => {
  try {
    const { userId = "anonymous", period = "7days" } = req.query;

    const analytics = await Analytics.findOneAndDelete({ userId, period });

    if (!analytics) {
      return res.status(404).json({
        error: "Analytics data not found",
      });
    }

    res.json({
      success: true,
      message: "Analytics data deleted successfully",
    });
  } catch (error) {
    console.error("Analytics delete error:", error);
    res.status(500).json({
      error: "Failed to delete analytics",
      message: error.message,
    });
  }
});

module.exports = router;
