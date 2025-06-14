import React, { useState } from "react";
import axios from "axios";

const niches = [
  "fashion",
  "fitness",
  "finance",
  "food",
  "travel",
  "technology",
  "lifestyle",
  "beauty",
  "education",
  "entertainment",
];

const ContentGenerator = () => {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await axios.post(
        "http://localhost:5000/api/content/generate",
        {
          topic,
          niche,
        }
      );
      setContent(response.data);
    } catch (error) {
      setError("Failed to generate content. Please try again.");
      console.error("Error generating content:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Content Idea Generator</h1>

      <div className="card mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="topic"
            >
              Topic
            </label>
            <input
              id="topic"
              type="text"
              className="input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your content topic"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="niche"
            >
              Content Niche
            </label>
            <select
              id="niche"
              className="input"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              required
            >
              <option value="">Select a niche</option>
              {niches.map((n) => (
                <option key={n} value={n}>
                  {n.charAt(0).toUpperCase() + n.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Content"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {content && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Generated Content</h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Hook</h3>
            <p className="text-gray-700">{content.hook}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Reel Idea</h3>
            <p className="text-gray-700">{content.reelIdea}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Caption</h3>
            <p className="text-gray-700">{content.caption}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Hashtags</h3>
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;
