import React from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import {
  Lightbulb,
  BarChart3,
  Bookmark,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Coffee,
  Star,
  Users,
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useUser();

  const features = [
    {
      title: "AI Content Ideas",
      description:
        "Generate creative Instagram reel ideas, captions, and hashtags using AI",
      icon: Lightbulb,
      link: "/content-ideas",
      color: "from-amber-700 to-orange-800",
      bgColor: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Analytics Dashboard",
      description:
        "Track your Instagram performance with detailed insights and metrics",
      icon: BarChart3,
      link: "/analytics",
      color: "from-stone-700 to-amber-800",
      bgColor: "from-stone-50 to-amber-50",
      borderColor: "border-stone-200",
    },
    {
      title: "Content Bank",
      description:
        "Browse and manage your saved content ideas with search and filters",
      icon: Bookmark,
      link: "/content-bank",
      color: "from-amber-800 to-yellow-800",
      bgColor: "from-amber-50 to-yellow-50",
      borderColor: "border-amber-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-stone-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative pt-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
            <div className="flex justify-between items-center h-16 px-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-2.5 rounded-full shadow-lg">
                  <Coffee className="h-6 w-6 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
                  Creator Platform
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-stone-600 font-medium">
                  Welcome,{" "}
                  <span className="text-amber-700 font-semibold">
                    {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                  </span>
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 ring-2 ring-amber-200",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl shadow-lg mb-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-stone-800 via-amber-800 to-orange-800 bg-clip-text text-transparent mb-6 leading-tight">
            Welcome to Your Creator Dashboard
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Elevate your Instagram content creation with AI-powered insights and
            sophisticated analytics. Everything you need to build your creative
            empire.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={feature.link} className="group block">
                <div
                  className={`bg-white/70 backdrop-blur-sm rounded-2xl p-8 h-full transition-all duration-500 hover:shadow-2xl hover:scale-105 ${feature.borderColor} border-2 hover:bg-white/90 relative overflow-hidden`}
                >
                  {/* Subtle gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-30 rounded-2xl`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl w-fit mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-800 mb-4 group-hover:text-amber-800 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-stone-600 mb-6 leading-relaxed text-base">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-amber-700 font-semibold group-hover:text-amber-800 transition-colors">
                      <span>Explore Now</span>
                      <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-10 border border-stone-200">
          <h3 className="text-3xl font-bold text-stone-800 mb-8 flex items-center">
            <TrendingUp className="h-8 w-8 mr-3 text-amber-700" />
            Platform Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl mb-4">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-amber-800 mb-2">
                AI-Powered
              </div>
              <div className="text-stone-600 font-medium">
                Content Generation
              </div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-stone-50 to-amber-50 rounded-2xl border border-stone-200 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-stone-600 to-amber-700 rounded-2xl mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-stone-800 mb-2">
                Real-time
              </div>
              <div className="text-stone-600 font-medium">
                Analytics Dashboard
              </div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-yellow-700 rounded-2xl mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-orange-800 mb-2">
                Premium
              </div>
              <div className="text-stone-600 font-medium">
                Content Management
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-3 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-stone-800">10K+</div>
                <div className="text-stone-600">Active Creators</div>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-stone-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-stone-600 to-amber-700 p-3 rounded-xl">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-stone-800">50M+</div>
                <div className="text-stone-600">Content Ideas Generated</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
