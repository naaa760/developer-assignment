const express = require("express");
const { Groq } = require("groq-sdk");
const Content = require("../models/Content");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate content using Groq API
router.post("/generate", requireAuth, async (req, res) => {
  try {
    const { topic, niche } = req.body;
    const userId = req.auth.userId; // Get user ID from Clerk auth

    // Validation
    if (!topic || !niche) {
      return res.status(400).json({
        error: "Topic and niche are required",
      });
    }

    // Create prompt for Groq API
    const prompt = `You are a content strategist. Suggest one trending Instagram reel idea for a creator in the ${niche} niche about ${topic}.

Please respond in JSON format with the following structure:
{
  "reelIdea": "A specific, actionable reel idea",
  "caption": "An engaging caption for the reel",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "hook": "A strong opening hook or first line"
}

Make sure the response is valid JSON and creative, engaging content suitable for Instagram.`;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      stream: false,
      stop: null,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let aiResponse;
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      // Fallback response if parsing fails
      aiResponse = {
        reelIdea: `Create engaging ${niche} content about ${topic}`,
        caption: `Check out this amazing ${topic} content! Perfect for anyone interested in ${niche}. What do you think?`,
        hashtags: [
          `#${niche}`,
          `#${topic.replace(/\s+/g, "")}`,
          "#content",
          "#instagram",
          "#viral",
        ],
        hook: `Did you know about ${topic}? Here's what you need to know!`,
      };
    }

    // Ensure hashtags is an array
    if (!Array.isArray(aiResponse.hashtags)) {
      aiResponse.hashtags = [
        `#${niche}`,
        `#${topic.replace(/\s+/g, "")}`,
        "#content",
        "#instagram",
        "#viral",
      ];
    }

    // Save to database
    const content = new Content({
      topic,
      niche,
      reelIdea: aiResponse.reelIdea,
      caption: aiResponse.caption,
      hashtags: aiResponse.hashtags,
      hook: aiResponse.hook,
      userId,
    });

    await content.save();

    res.json({
      success: true,
      data: {
        id: content._id,
        topic,
        niche,
        ...aiResponse,
        createdAt: content.createdAt,
      },
    });
  } catch (error) {
    console.error("Content generation error:", error);
    res.status(500).json({
      error: "Failed to generate content",
      message: error.message,
    });
  }
});

// Get all saved content (Content Bank)
router.get("/bank", requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, niche, search } = req.query;
    const userId = req.auth.userId; // Get user ID from Clerk auth

    const query = { userId };

    // Add niche filter if provided
    if (niche) {
      query.niche = niche;
    }

    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const content = await Content.find(query)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit)
      .exec();

    const total = await Content.countDocuments(query);

    res.json({
      success: true,
      data: content,
      pagination: {
        current: options.page,
        pages: Math.ceil(total / options.limit),
        total,
      },
    });
  } catch (error) {
    console.error("Content bank error:", error);
    res.status(500).json({
      error: "Failed to fetch content bank",
      message: error.message,
    });
  }
});

// Get single content item
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const content = await Content.findOne({
      _id: req.params.id,
      userId: userId,
    });

    if (!content) {
      return res.status(404).json({
        error: "Content not found",
      });
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Get content error:", error);
    res.status(500).json({
      error: "Failed to fetch content",
      message: error.message,
    });
  }
});

// Delete content item
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const content = await Content.findOneAndDelete({
      _id: req.params.id,
      userId: userId,
    });

    if (!content) {
      return res.status(404).json({
        error: "Content not found",
      });
    }

    res.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Delete content error:", error);
    res.status(500).json({
      error: "Failed to delete content",
      message: error.message,
    });
  }
});

// Get available niches (public route - no auth required)
router.get("/meta/niches", (req, res) => {
  const niches = [
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
  ];

  res.json({
    success: true,
    data: niches,
  });
});

module.exports = router;
