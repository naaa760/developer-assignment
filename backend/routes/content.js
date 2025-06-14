const express = require("express");
const router = express.Router();
const { Groq } = require("groq-sdk");
const Content = require("../models/Content");
const auth = require("../middleware/auth");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate content using GROQ API
router.post("/generate", auth, async (req, res) => {
  try {
    const { topic, niche } = req.body;

    const prompt = `You are a content strategist. Suggest one trending Instagram reel idea for a creator in the ${niche} niche about ${topic}.
    Include a caption, 5 relevant hashtags, and a strong opening hook.
    Format the response as JSON with the following structure:
    {
      "reelIdea": "detailed idea description",
      "caption": "engaging caption",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
      "hook": "attention-grabbing first line"
    }`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = JSON.parse(completion.choices[0].message.content);

    // Save to database
    const content = new Content({
      user: req.user.userId,
      topic,
      niche,
      ...response,
    });

    await content.save();

    res.json(content);
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ message: "Error generating content" });
  }
});

// Get user's content history
router.get("/history", auth, async (req, res) => {
  try {
    const content = await Content.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Error fetching content history" });
  }
});

module.exports = router;
