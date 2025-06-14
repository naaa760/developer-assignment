import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Wand2,
  Coffee,
} from "lucide-react";
import { contentAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToastSimple } from "../components/Toaster";
import { useUser, UserButton } from "@clerk/clerk-react";

const ContentIdeasPage = () => {
  const { user } = useUser();
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
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-yellow-50 relative overflow-hidden">
      {/* Decorative Background Pattern Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Diagonal Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 60"
                  stroke="url(#gradient)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                />
                <path
                  d="M 0 0 L 60 60"
                  stroke="url(#gradient)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                />
              </pattern>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5a3c" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#a0845c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6b4423" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Shining Lines */}
        <div className="absolute top-20 left-10 w-96 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-30 rotate-12 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-0.5 bg-gradient-to-r from-transparent via-stone-300 to-transparent opacity-40 -rotate-12 animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-72 h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-35 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-25 -rotate-45 animate-pulse"></div>

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-stone-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-yellow-200/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Transparent Oval Navbar */}
      <header className="relative pt-6 px-6 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/30 backdrop-blur-md rounded-full border border-stone-200/50 shadow-lg">
            <div className="flex justify-between items-center h-16 px-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-amber-700 to-stone-800 p-2.5 rounded-full shadow-lg">
                  <Coffee className="h-6 w-6 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
                  Creator Platform
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-stone-700 font-medium">
                  Welcome,{" "}
                  <span className="text-amber-800 font-semibold">
                    {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                  </span>
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 ring-2 ring-amber-300",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Header */}
      <div className="text-center relative z-10 py-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-amber-700 to-stone-800 p-4 rounded-2xl shadow-xl">
            <Lightbulb className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-stone-800 via-amber-800 to-yellow-800 bg-clip-text text-transparent mb-4">
          AI Content Ideas Generator
        </h1>
        <p className="text-xl text-stone-700 max-w-2xl mx-auto leading-relaxed">
          Get creative Instagram reel ideas, captions, and hashtags powered by
          AI. Just enter your topic and choose your niche!
        </p>
      </div>

      {/* Content Generation Form */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-stone-200/50 relative overflow-hidden max-w-4xl mx-auto mb-8 mx-4">
        {/* Form Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="formGrid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="#8b5a3c" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#formGrid)" />
          </svg>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Topic Input */}
            <div className="space-y-3">
              <label
                htmlFor="topic"
                className="block text-sm font-bold text-stone-800 mb-3"
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
                className="w-full px-4 py-4 border-2 border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white/95 backdrop-blur-sm text-stone-900 placeholder-stone-500"
                required
              />
              <p className="text-xs text-stone-600 mt-2">
                Be specific about what you want to create content about
              </p>
            </div>

            {/* Niche Selection */}
            <div className="space-y-3">
              <label
                htmlFor="niche"
                className="block text-sm font-bold text-stone-800 mb-3"
              >
                Content Niche
              </label>
              <select
                id="niche"
                name="niche"
                value={formData.niche}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border-2 border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white/95 backdrop-blur-sm text-stone-900"
                required
              >
                {niches.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche.charAt(0).toUpperCase() + niche.slice(1)}
                  </option>
                ))}
              </select>
              <p className="text-xs text-stone-600 mt-2">
                Choose the category that best fits your content
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isLoading || !formData.topic.trim()}
              className="bg-gradient-to-r from-amber-700 to-stone-800 hover:from-amber-800 hover:to-stone-900 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="text-lg">Generating Ideas...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-6 w-6" />
                  <span className="text-lg">Generate Content Ideas</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Content Display */}
      {generatedContent && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-stone-200/50 animate-fade-in relative overflow-hidden max-w-4xl mx-auto mb-8 mx-4">
          {/* Content Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="contentPattern"
                  width="80"
                  height="80"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 0 40 Q 20 20 40 40 T 80 40"
                    stroke="#8b5a3c"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.3"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#contentPattern)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent flex items-center">
                <Sparkles className="h-8 w-8 text-amber-700 mr-3" />
                Generated Content
              </h2>
              <button
                onClick={handleRegenerateContent}
                disabled={isLoading}
                className="bg-white/80 backdrop-blur-sm border-2 border-stone-200 text-stone-700 hover:bg-stone-50 px-6 py-3 rounded-2xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <RefreshCw
                  className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="font-semibold">Regenerate</span>
              </button>
            </div>

            <div className="grid gap-8">
              {/* Reel Idea */}
              <div className="bg-gradient-to-br from-stone-100 to-amber-100 rounded-2xl p-8 border border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-stone-800 flex items-center">
                    🎬 <span className="ml-2">Reel Idea</span>
                  </h3>
                  <button
                    onClick={() =>
                      handleCopy(generatedContent.reelIdea, "reelIdea")
                    }
                    className="bg-white/80 backdrop-blur-sm border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2"
                  >
                    {copiedField === "reelIdea" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-stone-900 leading-relaxed text-lg">
                  {generatedContent.reelIdea}
                </p>
              </div>

              {/* Hook */}
              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl p-8 border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-amber-800 flex items-center">
                    🪝 <span className="ml-2">Opening Hook</span>
                  </h3>
                  <button
                    onClick={() => handleCopy(generatedContent.hook, "hook")}
                    className="bg-white/80 backdrop-blur-sm border border-amber-300 text-amber-700 hover:bg-amber-50 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2"
                  >
                    {copiedField === "hook" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-amber-900 leading-relaxed font-semibold text-lg">
                  {generatedContent.hook}
                </p>
              </div>

              {/* Caption */}
              <div className="bg-gradient-to-br from-yellow-100 to-stone-100 rounded-2xl p-8 border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-yellow-800 flex items-center">
                    📝 <span className="ml-2">Caption</span>
                  </h3>
                  <button
                    onClick={() =>
                      handleCopy(generatedContent.caption, "caption")
                    }
                    className="bg-white/80 backdrop-blur-sm border border-yellow-300 text-yellow-700 hover:bg-yellow-50 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2"
                  >
                    {copiedField === "caption" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-yellow-900 leading-relaxed whitespace-pre-line text-lg">
                  {generatedContent.caption}
                </p>
              </div>

              {/* Hashtags */}
              <div className="bg-gradient-to-br from-stone-100 to-amber-100 rounded-2xl p-8 border border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-stone-800 flex items-center">
                    # <span className="ml-2">Hashtags</span>
                  </h3>
                  <button
                    onClick={() =>
                      handleCopy(
                        generatedContent.hashtags.join(" "),
                        "hashtags"
                      )
                    }
                    className="bg-white/80 backdrop-blur-sm border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2"
                  >
                    {copiedField === "hashtags" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {generatedContent.hashtags.map((hashtag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-stone-200 to-amber-200 text-stone-800 px-4 py-2 rounded-full text-sm font-semibold border border-stone-300 shadow-sm"
                    >
                      {hashtag.startsWith("#") ? hashtag : `#${hashtag}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Meta Information */}
            <div className="mt-8 p-6 bg-gradient-to-r from-stone-50 to-amber-50 rounded-2xl border border-stone-200">
              <div className="flex flex-wrap items-center gap-6 text-sm text-stone-700">
                <span className="flex items-center font-semibold">
                  📅 Generated:{" "}
                  <span className="ml-1 text-stone-800">
                    {new Date(generatedContent.createdAt).toLocaleString()}
                  </span>
                </span>
                <span className="flex items-center font-semibold">
                  🎯 Niche:{" "}
                  <span className="ml-1 text-stone-800">
                    {generatedContent.niche.charAt(0).toUpperCase() +
                      generatedContent.niche.slice(1)}
                  </span>
                </span>
                <span className="flex items-center font-semibold">
                  💭 Topic:{" "}
                  <span className="ml-1 text-stone-800">
                    {generatedContent.topic}
                  </span>
                </span>
              </div>
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
              className={`p-4 rounded-2xl shadow-xl animate-slide-up backdrop-blur-sm ${
                toast.type === "success"
                  ? "bg-green-100/90 text-green-800 border border-green-300"
                  : toast.type === "error"
                  ? "bg-red-100/90 text-red-800 border border-red-300"
                  : "bg-blue-100/90 text-blue-800 border border-blue-300"
              }`}
            >
              <div className="flex items-center">
                {toast.type === "success" && <Check className="h-5 w-5 mr-2" />}
                {toast.type === "error" && (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                <span className="text-sm font-semibold">{toast.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentIdeasPage;
