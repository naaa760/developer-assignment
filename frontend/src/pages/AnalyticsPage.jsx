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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-lg text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const followerChartData = {
    labels:
      analyticsData?.followers.map((_, index) => `Day ${index + 1}`) || [],
    datasets: [
      {
        label: "Followers",
        data: analyticsData?.followers || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
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
        backgroundColor: "rgba(239, 68, 68, 0.8)",
      },
      {
        label: "Comments",
        data: analyticsData?.engagement.map((post) => post.comments) || [],
        backgroundColor: "rgba(34, 197, 94, 0.8)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-full">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Instagram Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your Instagram performance with detailed insights and metrics
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label
                  htmlFor="period"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Time Period
                </label>
                <select
                  id="period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="select"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={generateSampleData}
                disabled={isLoading}
                className="btn-secondary flex items-center space-x-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Generate Sample</span>
              </button>

              <label className="btn-outline cursor-pointer flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>{isUploading ? "Uploading..." : "Upload JSON"}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>

              <button
                onClick={exportReport}
                className="btn-primary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {analyticsData && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Current Followers
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.metrics.currentFollowers.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
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
                    <span className="text-sm font-medium">
                      {analyticsData.metrics.followerGrowth >= 0 ? "+" : ""}
                      {analyticsData.metrics.followerGrowth}(
                      {analyticsData.metrics.followerGrowthPercentage}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Likes
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.metrics.totalLikes.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Avg per post:{" "}
                    {Math.round(
                      analyticsData.metrics.totalLikes /
                        analyticsData.engagement.length
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Comments
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.metrics.totalComments.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Avg per post:{" "}
                    {Math.round(
                      analyticsData.metrics.totalComments /
                        analyticsData.engagement.length
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Engagement Rate
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.metrics.engagementRate}%
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {analyticsData.metrics.totalEngagement} total interactions
                  </p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Follower Growth Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Follower Growth Over Time
                </h3>
                <div className="h-64">
                  <Line data={followerChartData} options={chartOptions} />
                </div>
              </div>

              {/* Engagement Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Post Engagement
                </h3>
                <div className="h-64">
                  <Bar data={engagementChartData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Best Time to Post & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Best Time to Post
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {analyticsData.bestPostTime}
                  </p>
                  <p className="text-gray-600">
                    Optimal posting time based on engagement patterns
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Recent Posts Performance
                </h3>
                <div className="space-y-3">
                  {analyticsData.engagement.slice(0, 5).map((post) => {
                    const totalEngagement = post.likes + post.comments;
                    const maxEngagement = Math.max(
                      ...analyticsData.engagement.map(
                        (p) => p.likes + p.comments
                      )
                    );
                    const percentage = (totalEngagement / maxEngagement) * 100;

                    return (
                      <div
                        key={post.post}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">
                              {post.post}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Post {post.post}
                            </p>
                            <p className="text-xs text-gray-500">
                              {post.likes} likes • {post.comments} comments
                            </p>
                          </div>
                        </div>
                        <div className="w-24">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Data Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Analytics Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">Period</p>
                  <p className="text-gray-600">{analyticsData.period}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">
                    Total Posts Analyzed
                  </p>
                  <p className="text-gray-600">
                    {analyticsData.engagement.length}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">Last Updated</p>
                  <p className="text-gray-600">
                    {new Date(analyticsData.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </>
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

export default AnalyticsPage;
