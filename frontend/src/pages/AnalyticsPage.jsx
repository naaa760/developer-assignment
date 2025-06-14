import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Clock,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  Coffee,
  Home,
  Lightbulb,
  Bookmark,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { analyticsAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToastSimple } from "../components/Toaster";
import { useUser, UserButton } from "@clerk/clerk-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsPage = () => {
  const { user } = useUser();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("7days");
  const [isUploading, setIsUploading] = useState(false);
  const { toasts, addToast } = useToastSimple();

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await analyticsAPI.getAnalytics({ period });
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      addToast(error.message || "Failed to load analytics", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleData = async () => {
    setIsLoading(true);
    try {
      await analyticsAPI.generateSampleData({ period });
      await loadAnalytics();
      addToast("Sample data generated successfully!", "success");
    } catch (error) {
      console.error("Failed to generate sample data:", error);
      addToast(error.message || "Failed to generate sample data", "error");
    }
  };

  const exportReport = async () => {
    try {
      const response = await analyticsAPI.exportAnalytics({ period });

      // Create blob and download
      const blob = new Blob([JSON.stringify(response, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics-report-${period}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addToast("Report exported successfully!", "success");
    } catch (error) {
      console.error("Failed to export report:", error);
      addToast(error.message || "Failed to export report", "error");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileContent = await file.text();
      const jsonData = JSON.parse(fileContent);

      // Validate data structure
      if (!jsonData.followers || !jsonData.engagement) {
        throw new Error(
          "Invalid data format. Expected followers and engagement arrays."
        );
      }

      await analyticsAPI.uploadAnalytics({
        ...jsonData,
        period,
      });

      await loadAnalytics();
      addToast("Analytics data uploaded successfully!", "success");
    } catch (error) {
      console.error("Failed to upload data:", error);
      addToast(error.message || "Failed to upload data", "error");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  if (isLoading && !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-yellow-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="loadingGrid"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 60"
                    stroke="#8b5a3c"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.3"
                  />
                  <path
                    d="M 0 0 L 60 60"
                    stroke="#8b5a3c"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.3"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#loadingGrid)" />
            </svg>
          </div>
        </div>
        <div className="text-center relative z-10">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-lg text-stone-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data with beautiful colors
  const followerChartData = {
    labels:
      analyticsData?.followers.map((_, index) => `Day ${index + 1}`) || [],
    datasets: [
      {
        label: "Followers",
        data: analyticsData?.followers || [],
        borderColor: "#d97706",
        backgroundColor: "rgba(217, 119, 6, 0.1)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const engagementChartData = {
    labels: analyticsData?.engagement.map((post) => `Post ${post.post}`) || [],
    datasets: [
      {
        label: "Likes",
        data: analyticsData?.engagement.map((post) => post.likes) || [],
        backgroundColor: "rgba(180, 83, 9, 0.8)",
      },
      {
        label: "Comments",
        data: analyticsData?.engagement.map((post) => post.comments) || [],
        backgroundColor: "rgba(161, 98, 7, 0.8)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#78716c",
          font: {
            family: "Inter, sans-serif",
            weight: "500",
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#78716c",
        },
        grid: {
          color: "rgba(120, 113, 108, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#78716c",
        },
        grid: {
          color: "rgba(120, 113, 108, 0.1)",
        },
      },
    },
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
                id="analyticsGrid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 60"
                  stroke="url(#analyticsGradient)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                />
                <path
                  d="M 0 0 L 60 60"
                  stroke="url(#analyticsGradient)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                />
              </pattern>
              <linearGradient
                id="analyticsGradient"
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
            <rect width="100%" height="100%" fill="url(#analyticsGrid)" />
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
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white/50 text-amber-800 border border-amber-200"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </a>
                <a
                  href="/content-bank"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-stone-700 hover:bg-white/50 hover:text-amber-800"
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
              <BarChart3 className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-stone-800 via-amber-800 to-yellow-800 bg-clip-text text-transparent mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-xl text-stone-700 max-w-2xl mx-auto leading-relaxed">
            Track your content performance and audience growth with detailed
            insights and beautiful visualizations.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-stone-200/50 max-w-7xl mx-auto mb-8 mx-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-bold text-stone-800">
                Time Period:
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white/95 text-stone-900"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={generateSampleData}
                disabled={isLoading}
                className="bg-gradient-to-r from-amber-700 to-stone-800 hover:from-amber-800 hover:to-stone-900 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Generate Sample</span>
              </button>

              <button
                onClick={exportReport}
                className="bg-white/80 backdrop-blur-sm border-2 border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold px-6 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>

              <label className="bg-white/80 backdrop-blur-sm border-2 border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold px-6 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>{isUploading ? "Uploading..." : "Upload"}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>

        {analyticsData && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8 px-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-stone-200/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-stone-600">
                      Current Followers
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
                      {analyticsData.metrics.currentFollowers.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-100 to-stone-100 p-3 rounded-full shadow-lg">
                    <Users className="h-6 w-6 text-amber-700" />
                  </div>
                </div>
                <div className="mt-4">
                  <div
                    className={`flex items-center ${
                      analyticsData.metrics.followerGrowth >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-semibold">
                      {analyticsData.metrics.followerGrowth >= 0 ? "+" : ""}
                      {analyticsData.metrics.followerGrowth} (
                      {analyticsData.metrics.followerGrowthPercentage}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-stone-200/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-stone-600">
                      Average Likes
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
                      {analyticsData.metrics.averageLikes.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-red-100 to-pink-100 p-3 rounded-full shadow-lg">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-stone-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm font-semibold">
                      Per post in {period}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-stone-200/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-stone-600">
                      Average Comments
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
                      {analyticsData.metrics.averageComments.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-full shadow-lg">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-stone-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm font-semibold">
                      Per post in {period}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-stone-200/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-stone-600">
                      Engagement Rate
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
                      {analyticsData.metrics.engagementRate}%
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-3 rounded-full shadow-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-stone-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm font-semibold">Last {period}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4">
              {/* Follower Growth Chart */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-stone-200/50">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent mb-6">
                  Follower Growth
                </h3>
                <div className="h-80">
                  <Line data={followerChartData} options={chartOptions} />
                </div>
              </div>

              {/* Engagement Chart */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-stone-200/50">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent mb-6">
                  Post Engagement
                </h3>
                <div className="h-80">
                  <Bar data={engagementChartData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Recent Posts Performance */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-stone-200/50 max-w-7xl mx-auto mt-8 mx-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent mb-6">
                Recent Posts Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-3 px-4 font-bold text-stone-700">
                        Post
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-stone-700">
                        Likes
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-stone-700">
                        Comments
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-stone-700">
                        Engagement
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.engagement.map((post, index) => (
                      <tr
                        key={index}
                        className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-semibold text-stone-800">
                          Post {post.post}
                        </td>
                        <td className="py-3 px-4 text-stone-700">
                          {post.likes.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-stone-700">
                          {post.comments.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-gradient-to-r from-amber-100 to-stone-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {(
                              ((post.likes + post.comments) /
                                analyticsData.metrics.currentFollowers) *
                              100
                            ).toFixed(2)}
                            %
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!analyticsData && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-stone-200/50 max-w-2xl mx-auto mx-4">
              <BarChart3 className="h-16 w-16 text-stone-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-stone-800 mb-4">
                No Analytics Data
              </h3>
              <p className="text-stone-600 mb-6">
                Get started by generating sample data or uploading your
                analytics.
              </p>
              <button
                onClick={generateSampleData}
                className="bg-gradient-to-r from-amber-700 to-stone-800 hover:from-amber-800 hover:to-stone-900 text-white font-bold px-8 py-3 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Generate Sample Data
              </button>
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

export default AnalyticsPage;
