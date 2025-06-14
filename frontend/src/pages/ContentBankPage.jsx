import React, { useState, useEffect } from "react";
import {
  Bookmark,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  Calendar,
  Hash,
  MessageSquare,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Home,
  BarChart3,
} from "lucide-react";
import { contentAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToastSimple } from "../components/Toaster";
import { useUser, UserButton } from "@clerk/clerk-react";

const ContentBankPage = () => {
  const { user } = useUser();
  const [contentBank, setContentBank] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [niches, setNiches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [copiedField, setCopiedField] = useState("");
  const { toasts, addToast } = useToastSimple();

  const itemsPerPage = 9;

  useEffect(() => {
    loadNiches();
  }, []);

  useEffect(() => {
    loadContentBank();
  }, [currentPage, searchTerm, selectedNiche]);

  const loadNiches = async () => {
    try {
      const response = await contentAPI.getNiches();
      setNiches(response.data);
    } catch (error) {
      console.error("Failed to load niches:", error);
    }
  };

  const loadContentBank = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedNiche && { niche: selectedNiche }),
      };

      const response = await contentAPI.getContentBank(params);
      setContentBank(response.data);
      setTotalPages(response.pagination.pages);
      setTotalItems(response.pagination.total);
    } catch (error) {
      console.error("Failed to load content bank:", error);
      addToast(error.message || "Failed to load content bank", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (contentId) => {
    if (!window.confirm("Are you sure you want to delete this content idea?")) {
      return;
    }

    try {
      await contentAPI.deleteContent(contentId);
      await loadContentBank();
      addToast("Content deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete content:", error);
      addToast(error.message || "Failed to delete content", "error");
    }
  };

  const handleCopy = async (text, field, contentId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(`${contentId}-${field}`);
      addToast("Copied to clipboard!", "success");

      setTimeout(() => {
        setCopiedField("");
      }, 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      addToast("Failed to copy to clipboard", "error");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleNicheChange = (e) => {
    setSelectedNiche(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-yellow-50 relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Enhanced Diagonal Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="contentBankGrid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 60"
                  stroke="url(#contentBankGradient)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                />
                <path
                  d="M 0 0 L 60 60"
                  stroke="url(#contentBankGradient)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                />
              </pattern>
              <linearGradient
                id="contentBankGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8b5a3c" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#a0845c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6b4423" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#contentBankGrid)" />
          </svg>
        </div>

        {/* Shining Lines */}
        <div className="absolute top-20 left-10 w-96 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-30 rotate-12 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-0.5 bg-gradient-to-r from-transparent via-stone-300 to-transparent opacity-40 -rotate-12 animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-72 h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-35 rotate-45 animate-pulse"></div>

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-stone-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-yellow-200/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Transparent Oval Navbar */}
      <header className="relative pt-6 px-6 z-20">
        <div className="w-full">
          <div className="bg-white/30 backdrop-blur-md rounded-full border border-stone-200/50 shadow-lg max-w-7xl mx-auto">
            <div className="flex justify-between items-center h-16 px-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-amber-700 to-stone-800 p-2.5 rounded-full shadow-lg">
                  <Coffee className="h-6 w-6 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
                  Creator Platform
                </h1>
              </div>

              {/* Navigation Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                <a
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-stone-700 hover:bg-white/50 hover:text-amber-800"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </a>
                <a
                  href="/content-ideas"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-stone-700 hover:bg-white/50 hover:text-amber-800"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>Content Ideas</span>
                </a>
                <a
                  href="/analytics"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-stone-700 hover:bg-white/50 hover:text-amber-800"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </a>
                <a
                  href="/content-bank"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white/50 text-amber-800 border border-amber-200"
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Content Bank</span>
                </a>
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

      <div className="relative z-10 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-amber-700 to-stone-800 p-4 rounded-2xl shadow-xl">
              <Bookmark className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-stone-800 via-amber-800 to-yellow-800 bg-clip-text text-transparent mb-4">
            Content Bank
          </h1>
          <p className="text-xl text-stone-700 max-w-2xl mx-auto leading-relaxed">
            Browse and manage your saved content ideas. Search, filter, and
            reuse your AI-generated content.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-stone-200/50 max-w-7xl mx-auto mb-8 mx-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search content ideas, topics, captions..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 px-4 py-3 border-2 border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white/95 text-stone-900 placeholder-stone-500"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedNiche}
                onChange={handleNicheChange}
                className="w-full px-4 py-3 border-2 border-stone-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white/95 text-stone-900"
              >
                <option value="">All Niches</option>
                {niches.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche.charAt(0).toUpperCase() + niche.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-stone-600">
            <div>
              Showing {contentBank.length} of {totalItems} results
              {searchTerm && ` for "${searchTerm}"`}
              {selectedNiche && ` in ${selectedNiche}`}
            </div>
            {(searchTerm || selectedNiche) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedNiche("");
                  setCurrentPage(1);
                }}
                className="text-amber-700 hover:text-amber-900 font-semibold transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-lg text-stone-600">
                Loading content bank...
              </p>
            </div>
          </div>
        ) : contentBank.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-stone-200/50 max-w-2xl mx-auto mx-4">
              <Bookmark className="h-16 w-16 text-stone-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-stone-800 mb-4">
                {searchTerm || selectedNiche
                  ? "No content found"
                  : "No content saved yet"}
              </h3>
              <p className="text-stone-600 mb-6">
                {searchTerm || selectedNiche
                  ? "Try adjusting your search or filter criteria."
                  : "Start generating content ideas to build your content bank."}
              </p>
              {!(searchTerm || selectedNiche) && (
                <button
                  onClick={() => (window.location.href = "/content-ideas")}
                  className="bg-gradient-to-r from-amber-700 to-stone-800 hover:from-amber-800 hover:to-stone-900 text-white font-bold px-8 py-3 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  Generate Content Ideas
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
            {contentBank.map((content) => (
              <div
                key={content._id}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-stone-200/50 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-stone-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gradient-to-r from-amber-100 to-stone-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold border border-amber-200">
                      {content.niche.charAt(0).toUpperCase() +
                        content.niche.slice(1)}
                    </span>
                    <button
                      onClick={() => handleDelete(content._id)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 mb-2 line-clamp-2">
                    {content.topic}
                  </h3>
                  <div className="flex items-center text-xs text-stone-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(content.createdAt)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Reel Idea */}
                  <div className="bg-gradient-to-br from-stone-50 to-amber-50 rounded-2xl p-4 border border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-stone-700 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-1 text-amber-600" />
                        Reel Idea
                      </h4>
                      <button
                        onClick={() =>
                          handleCopy(content.reelIdea, "reelIdea", content._id)
                        }
                        className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-lg hover:bg-white/50"
                      >
                        {copiedField === `${content._id}-reelIdea` ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-stone-700 line-clamp-3 leading-relaxed">
                      {content.reelIdea}
                    </p>
                  </div>

                  {/* Hook */}
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-amber-800 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1 text-amber-600" />
                        Hook
                      </h4>
                      <button
                        onClick={() =>
                          handleCopy(content.hook, "hook", content._id)
                        }
                        className="text-amber-400 hover:text-amber-600 transition-colors p-1 rounded-lg hover:bg-white/50"
                      >
                        {copiedField === `${content._id}-hook` ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-amber-900 line-clamp-2 font-medium leading-relaxed">
                      {content.hook}
                    </p>
                  </div>

                  {/* Caption Preview */}
                  <div className="bg-gradient-to-br from-yellow-50 to-stone-50 rounded-2xl p-4 border border-yellow-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-yellow-800 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1 text-yellow-600" />
                        Caption
                      </h4>
                      <button
                        onClick={() =>
                          handleCopy(content.caption, "caption", content._id)
                        }
                        className="text-yellow-400 hover:text-yellow-600 transition-colors p-1 rounded-lg hover:bg-white/50"
                      >
                        {copiedField === `${content._id}-caption` ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-yellow-900 line-clamp-3 leading-relaxed">
                      {content.caption}
                    </p>
                  </div>

                  {/* Hashtags */}
                  <div className="bg-gradient-to-br from-stone-50 to-amber-50 rounded-2xl p-4 border border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-stone-700 flex items-center">
                        <Hash className="h-4 w-4 mr-1 text-stone-600" />
                        Hashtags
                      </h4>
                      <button
                        onClick={() =>
                          handleCopy(
                            content.hashtags.join(" "),
                            "hashtags",
                            content._id
                          )
                        }
                        className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-lg hover:bg-white/50"
                      >
                        {copiedField === `${content._id}-hashtags` ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {content.hashtags.slice(0, 6).map((hashtag, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-stone-200 to-amber-200 text-stone-700 px-2 py-1 rounded-lg text-xs font-medium"
                        >
                          {hashtag.startsWith("#") ? hashtag : `#${hashtag}`}
                        </span>
                      ))}
                      {content.hashtags.length > 6 && (
                        <span className="text-xs text-stone-500 px-2 py-1">
                          +{content.hashtags.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white/80 backdrop-blur-sm border-2 border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-xl transition-all duration-200 font-semibold ${
                      currentPage === page
                        ? "bg-gradient-to-r from-amber-700 to-stone-800 text-white shadow-xl"
                        : "bg-white/80 backdrop-blur-sm border border-stone-200 text-stone-700 hover:bg-stone-50 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-white/80 backdrop-blur-sm border-2 border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
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
                  <span className="text-sm font-semibold">{toast.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentBankPage;
