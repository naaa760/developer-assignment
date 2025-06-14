import React, { useState, useEffect } from "react";
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
  const [formData, setFormData] = useState({
    topic: "",
    niche: "",
  });
  const [generatedContent, setGeneratedContent] = useState(null);
  const [contentHistory, setContentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContentHistory();
  }, []);

  const fetchContentHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/content/history",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContentHistory(response.data);
    } catch (error) {
      console.error("Error fetching content history:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/content/generate",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGeneratedContent(response.data);
      fetchContentHistory();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">
            AI Content Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate viral Instagram reel ideas, engaging captions, trending
            hashtags, and powerful hooks tailored to your niche.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Content Generation Form */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
              Generate New Content
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Content Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  required
                  className="input"
                  placeholder="e.g., Morning routine, Productivity tips, Recipe tutorial"
                  value={formData.topic}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="niche"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Niche
                </label>
                <select
                  id="niche"
                  name="niche"
                  required
                  className="input"
                  value={formData.niche}
                  onChange={handleChange}
                >
                  <option value="">Select your niche</option>
                  <option value="fitness">Fitness & Health</option>
                  <option value="food">Food & Cooking</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="business">Business & Entrepreneurship</option>
                  <option value="technology">Technology</option>
                  <option value="travel">Travel</option>
                  <option value="fashion">Fashion & Beauty</option>
                  <option value="education">Education</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="finance">Personal Finance</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating Content...
                  </div>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Generate Content
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Content Display */}
          <div className="space-y-6">
            {generatedContent && (
              <div className="glass-card p-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Generated Content
                </h2>

                <div className="space-y-6">
                  {/* Reel Idea */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-blue-800 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Reel Idea
                      </h3>
                      <button
                        onClick={() =>
                          copyToClipboard(generatedContent.reelIdea)
                        }
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-blue-700">{generatedContent.reelIdea}</p>
                  </div>

                  {/* Hook */}
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-purple-800 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3"
                          />
                        </svg>
                        Opening Hook
                      </h3>
                      <button
                        onClick={() => copyToClipboard(generatedContent.hook)}
                        className="text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-purple-700 font-medium">
                      "{generatedContent.hook}"
                    </p>
                  </div>

                  {/* Caption */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-green-800 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                        Caption
                      </h3>
                      <button
                        onClick={() =>
                          copyToClipboard(generatedContent.caption)
                        }
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-green-700 whitespace-pre-line">
                      {generatedContent.caption}
                    </p>
                  </div>

                  {/* Hashtags */}
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-orange-800 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                          />
                        </svg>
                        Hashtags
                      </h3>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            generatedContent.hashtags
                              .map((tag) => `#${tag}`)
                              .join(" ")
                          )
                        }
                        className="text-orange-600 hover:text-orange-800 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.hashtags.map((hashtag, index) => (
                        <span
                          key={index}
                          className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content History */}
            {contentHistory.length > 0 && (
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Recent Content ({contentHistory.length})
                </h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {contentHistory.slice(0, 5).map((content, index) => (
                    <div
                      key={content._id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            {content.niche}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(content.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">
                        {content.topic}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {content.reelIdea}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;
