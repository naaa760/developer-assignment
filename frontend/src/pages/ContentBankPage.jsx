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
} from "lucide-react";
import { contentAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToastSimple } from "../components/Toaster";

const ContentBankPage = () => {
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
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-full">
              <Bookmark className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Content Bank
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse and manage your saved content ideas. Search, filter, and
            reuse your AI-generated content.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search content ideas, topics, captions..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="input pl-10 w-full"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedNiche}
                onChange={handleNicheChange}
                className="select w-full"
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
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
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
                className="text-blue-600 hover:text-blue-800 font-medium"
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
              <p className="mt-4 text-lg text-gray-600">
                Loading content bank...
              </p>
            </div>
          </div>
        ) : contentBank.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || selectedNiche
                  ? "No content found"
                  : "No content saved yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedNiche
                  ? "Try adjusting your search or filter criteria."
                  : "Start generating content ideas to build your content bank."}
              </p>
              {!(searchTerm || selectedNiche) && (
                <button
                  onClick={() => (window.location.href = "/content-ideas")}
                  className="btn-primary"
                >
                  Generate Content Ideas
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentBank.map((content) => (
              <div
                key={content._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {content.niche.charAt(0).toUpperCase() +
                        content.niche.slice(1)}
                    </span>
                    <button
                      onClick={() => handleDelete(content._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {content.topic}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(content.createdAt)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Reel Idea */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-1" />
                        Reel Idea
                      </h4>
                      <button
                        onClick={() =>
                          handleCopy(content.reelIdea, "reelIdea", content._id)
                        }
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copiedField === `${content._id}-reelIdea` ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {content.reelIdea}
                    </p>
                  </div>

                  {/* Hook */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Hook
                      </h4>
                      <button
                        onClick={() =>
                          handleCopy(content.hook, "hook", content._id)
                        }
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copiedField === `${content._id}-hook` ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 font-medium">
                      {content.hook}
                    </p>
                  </div>

                  {/* Caption */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-700">
                        Caption
                      </h4>
                      <button
                        onClick={() =>
                          handleCopy(content.caption, "caption", content._id)
                        }
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copiedField === `${content._id}-caption` ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {content.caption}
                    </p>
                  </div>

                  {/* Hashtags */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                        <Hash className="h-4 w-4 mr-1" />
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
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copiedField === `${content._id}-hashtags` ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {content.hashtags.slice(0, 3).map((hashtag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {hashtag.startsWith("#") ? hashtag : `#${hashtag}`}
                        </span>
                      ))}
                      {content.hashtags.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{content.hashtags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
                  <button
                    onClick={() =>
                      handleCopy(
                        `🎬 Reel Idea: ${content.reelIdea}\n\n🪝 Hook: ${
                          content.hook
                        }\n\n📝 Caption: ${
                          content.caption
                        }\n\n# Hashtags: ${content.hashtags.join(" ")}`,
                        "full",
                        content._id
                      )
                    }
                    className="btn-outline w-full text-sm"
                  >
                    {copiedField === `${content._id}-full` ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied All!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy All Content
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          pageNumber === currentPage
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
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
                <span className="text-sm font-medium">{toast.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentBankPage;
