import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Wand2,
} from "lucide-react";
import { contentAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToastSimple } from "../components/Toaster";

const ContentIdeasPage = () => {
  const [formData, setFormData] = useState({
    topic: "",
    niche: "lifestyle",
  });
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [niches, setNiches] = useState([]);
  const [copiedField, setCopiedField] = useState("");
  const { toasts, addToast } = useToastSimple();

  // Load available niches on component mount
  useEffect(() => {
    const loadNiches = async () => {
      try {
        const response = await contentAPI.getNiches();
        setNiches(response.data);
      } catch (error) {
        console.error("Failed to load niches:", error);
        // Fallback niches
        setNiches([
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
        ]);
      }
    };

    loadNiches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.topic.trim()) {
      addToast("Please enter a topic", "error");
      return;
    }

    setIsLoading(true);
    setGeneratedContent(null);

    try {
      const response = await contentAPI.generateContent(formData);
      setGeneratedContent(response.data);
      addToast("Content generated successfully!", "success");
    } catch (error) {
      console.error("Content generation error:", error);
      addToast(error.message || "Failed to generate content", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      addToast("Copied to clipboard!", "success");

      setTimeout(() => {
        setCopiedField("");
      }, 2000);
    } catch {
      addToast("Failed to copy to clipboard", "error");
    }
  };

  const handleRegenerateContent = () => {
    if (formData.topic.trim()) {
      handleSubmit({ preventDefault: () => {} });
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Content Ideas Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get creative Instagram reel ideas, captions, and hashtags powered by
            AI. Just enter your topic and choose your niche!
          </p>
        </div>

        {/* Content Generation Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Topic Input */}
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Content Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  placeholder="e.g., Morning workout routine, Budget-friendly fashion tips..."
                  className="input w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific about what you want to create content about
                </p>
              </div>

              {/* Niche Selection */}
              <div>
                <label
                  htmlFor="niche"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Content Niche
                </label>
                <select
                  id="niche"
                  name="niche"
                  value={formData.niche}
                  onChange={handleInputChange}
                  className="select w-full"
                  required
                >
                  {niches.map((niche) => (
                    <option key={niche} value={niche}>
                      {niche.charAt(0).toUpperCase() + niche.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose the category that best fits your content
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading || !formData.topic.trim()}
                className="btn-primary px-8 py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>Generating Ideas...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    <span>Generate Content Ideas</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Generated Content Display */}
        {generatedContent && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
                Generated Content
              </h2>
              <button
                onClick={handleRegenerateContent}
                disabled={isLoading}
                className="btn-outline flex items-center space-x-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Regenerate</span>
              </button>
            </div>

            <div className="grid gap-6">
              {/* Reel Idea */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    🎬 Reel Idea
                  </h3>
                  <button
                    onClick={() =>
                      handleCopy(generatedContent.reelIdea, "reelIdea")
                    }
                    className="btn-outline btn text-xs"
                  >
                    {copiedField === "reelIdea" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                <p className="text-gray-800 leading-relaxed">
                  {generatedContent.reelIdea}
                </p>
              </div>

              {/* Hook */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    🪝 Opening Hook
                  </h3>
                  <button
                    onClick={() => handleCopy(generatedContent.hook, "hook")}
                    className="btn-outline btn text-xs"
                  >
                    {copiedField === "hook" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                <p className="text-gray-800 leading-relaxed font-medium">
                  {generatedContent.hook}
                </p>
              </div>

              {/* Caption */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    📝 Caption
                  </h3>
                  <button
                    onClick={() =>
                      handleCopy(generatedContent.caption, "caption")
                    }
                    className="btn-outline btn text-xs"
                  >
                    {copiedField === "caption" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {generatedContent.caption}
                </p>
              </div>

              {/* Hashtags */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    # Hashtags
                  </h3>
                  <button
                    onClick={() =>
                      handleCopy(
                        generatedContent.hashtags.join(" "),
                        "hashtags"
                      )
                    }
                    className="btn-outline btn text-xs"
                  >
                    {copiedField === "hashtags" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map((hashtag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {hashtag.startsWith("#") ? hashtag : `#${hashtag}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Meta Information */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>
                  📅 Generated:{" "}
                  {new Date(generatedContent.createdAt).toLocaleString()}
                </span>
                <span>
                  🎯 Niche:{" "}
                  {generatedContent.niche.charAt(0).toUpperCase() +
                    generatedContent.niche.slice(1)}
                </span>
                <span>💭 Topic: {generatedContent.topic}</span>
              </div>
            </div>
          </div>
        )}

        {/* Toast Container */}
        {toasts.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`p-4 rounded-lg shadow-lg animate-slide-up ${
                  toast.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : toast.type === "error"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}
              >
                <div className="flex items-center">
                  {toast.type === "success" && (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  {toast.type === "error" && (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  )}
                  <span className="text-sm font-medium">{toast.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentIdeasPage;
