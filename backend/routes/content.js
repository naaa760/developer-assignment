const express = require("express");
const router = express.Router();
const { Groq } = require("groq-sdk");
const auth = require("../middleware/auth");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate content using GROQ API
router.post("/generate", auth, async (req, res) => {
  try {
    console.log("Content generation request:", req.body);
    const { topic, niche } = req.body;

    if (!topic || !niche) {
      return res.status(400).json({ message: "Topic and niche are required" });
    }

    const prompt = `You are a content strategist. Suggest one trending Instagram reel idea for a creator in the ${niche} niche about ${topic}.
    Include a caption, 5 relevant hashtags, and a strong opening hook.
    
    IMPORTANT: Respond ONLY with valid JSON in this exact format, no additional text or markdown:
    {
      "reelIdea": "detailed idea description",
      "caption": "engaging caption",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
      "hook": "attention-grabbing first line"
    }`;

    console.log("Calling GROQ API...");
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 1024,
    });

    console.log("GROQ API response:", completion.choices[0].message.content);

    // Extract JSON from the response (handle markdown code blocks)
    let responseText = completion.choices[0].message.content.trim();

    // Remove markdown code blocks if present
    if (responseText.includes("```")) {
      const jsonMatch = responseText.match(
        /```(?:json)?\s*(\{[\s\S]*?\})\s*```/
      );
      if (jsonMatch) {
        responseText = jsonMatch[1];
      }
    }

    // Try to find JSON object if it's mixed with other text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }

    console.log("Extracted JSON:", responseText);
    const response = JSON.parse(responseText);

    // Create content object with ID for in-memory storage
    const content = {
      _id: Date.now().toString(),
      user: req.user.userId,
      topic,
      niche,
      ...response,
      createdAt: new Date(),
    };

    // Store in global array for now
    if (!global.content) {
      global.content = [];
    }
    global.content.push(content);

    console.log("Content generated successfully");
    res.json(content);
  } catch (error) {
    console.error("Error generating content:", error);
    res
      .status(500)
      .json({ message: "Error generating content", error: error.message });
  }
});

// Get user's content history
router.get("/history", auth, async (req, res) => {
  try {
    if (!global.content) {
      global.content = [];
    }

    const userContent = global.content
      .filter((content) => content.user === req.user.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(userContent);
  } catch (error) {
    console.error("Error fetching content history:", error);
    res.status(500).json({ message: "Error fetching content history" });
  }
});

module.exports = router;
