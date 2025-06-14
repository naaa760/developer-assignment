import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/analytics");
      setAnalytics(response.data);
    } catch (error) {
      setError("Failed to fetch analytics data");
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const followerData = {
    labels: analytics.followers.map((f) =>
      new Date(f.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Followers",
        data: analytics.followers.map((f) => f.count),
        borderColor: "rgb(14, 165, 233)",
        backgroundColor: "rgba(14, 165, 233, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const engagementData = {
    labels: analytics.engagement.map((e) => `Post ${e.post}`),
    datasets: [
      {
        label: "Likes",
        data: analytics.engagement.map((e) => e.likes),
        backgroundColor: "rgba(14, 165, 233, 0.5)",
      },
      {
        label: "Comments",
        data: analytics.engagement.map((e) => e.comments),
        backgroundColor: "rgba(99, 102, 241, 0.5)",
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Instagram Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Follower Growth</h2>
          <Line
            data={followerData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "7-Day Follower Growth",
                },
              },
            }}
          />
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Engagement Rate</h2>
          <Bar
            data={engagementData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Recent Posts Engagement",
                },
              },
            }}
          />
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Best Time to Post</h2>
          <div className="text-center py-8">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {analytics.bestPostTime.day}
            </div>
            <div className="text-2xl text-gray-600">
              {analytics.bestPostTime.time}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {analytics.followers[analytics.followers.length - 1].count}
              </div>
              <div className="text-gray-600">Total Followers</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {Math.round(
                  analytics.engagement.reduce(
                    (acc, curr) => acc + curr.likes + curr.comments,
                    0
                  ) / analytics.engagement.length
                )}
              </div>
              <div className="text-gray-600">Avg. Engagement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
