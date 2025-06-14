import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const [recentContent, setRecentContent] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, analyticsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/content/history"),
          axios.get("http://localhost:5000/api/analytics"),
        ]);
        setRecentContent(contentRes.data.slice(0, 3));
        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your creator platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quick Stats</h2>
            <Link
              to="/analytics"
              className="text-primary-600 hover:text-primary-700"
            >
              View All
            </Link>
          </div>
          {analytics && (
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
          )}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Best Time to Post</h2>
            <Link
              to="/analytics"
              className="text-primary-600 hover:text-primary-700"
            >
              View Details
            </Link>
          </div>
          {analytics && (
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {analytics.bestPostTime.day}
              </div>
              <div className="text-xl text-gray-600">
                {analytics.bestPostTime.time}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Content Ideas</h2>
          <Link
            to="/content"
            className="text-primary-600 hover:text-primary-700"
          >
            Generate New
          </Link>
        </div>
        {recentContent.length > 0 ? (
          <div className="space-y-4">
            {recentContent.map((content) => (
              <div
                key={content._id}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{content.topic}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Niche: {content.niche}
                    </p>
                    <p className="text-gray-700">{content.hook}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {content.hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            No content generated yet. Start by generating your first content
            idea!
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
