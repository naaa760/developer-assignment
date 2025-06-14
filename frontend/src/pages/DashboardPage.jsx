import React, { useEffect } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import {
  Lightbulb,
  BarChart3,
  Bookmark,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cleanClerkParams } from "../utils/urlCleanup";

const DashboardPage = () => {
  const { user } = useUser();
  const location = useLocation();

  // Clean up URL parameters on component mount
  useEffect(() => {
    cleanClerkParams();
  }, [location]);

  const features = [
    {
      title: "AI Content Ideas",
      description:
        "Generate creative Instagram reel ideas, captions, and hashtags using AI",
      icon: Lightbulb,
      link: "/content-ideas",
      color: "from-purple-600 to-blue-600",
      bgColor: "from-purple-50 to-blue-50",
    },
    {
      title: "Analytics Dashboard",
      description:
        "Track your Instagram performance with detailed insights and metrics",
      icon: BarChart3,
      link: "/analytics",
      color: "from-green-600 to-blue-600",
      bgColor: "from-green-50 to-blue-50",
    },
    {
      title: "Content Bank",
      description:
        "Browse and manage your saved content ideas with search and filters",
      icon: Bookmark,
      link: "/content-bank",
      color: "from-orange-600 to-red-600",
      bgColor: "from-orange-50 to-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">
                Creator Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome,{" "}
                {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </span>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Creator Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Supercharge your Instagram content creation with AI-powered ideas
            and comprehensive analytics. Everything you need to grow your
            presence.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={feature.link} className="group block">
                <div
                  className={`bg-gradient-to-br ${feature.bgColor} rounded-xl p-8 h-full transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-100`}
                >
                  <div
                    className={`bg-gradient-to-r ${feature.color} p-3 rounded-full w-fit mb-6`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
            Quick Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                AI-Powered
              </div>
              <div className="text-gray-600">Content Generation</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                Real-time
              </div>
              <div className="text-gray-600">Analytics Dashboard</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                Smart
              </div>
              <div className="text-gray-600">Content Management</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
