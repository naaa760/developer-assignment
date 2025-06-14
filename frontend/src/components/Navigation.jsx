import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import {
  Lightbulb,
  BarChart3,
  Bookmark,
  Sparkles,
  Home,
  Menu,
  X,
} from "lucide-react";

const Navigation = () => {
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: Home,
      description: "Main dashboard overview",
    },
    {
      path: "/content-ideas",
      name: "Content Ideas",
      icon: Lightbulb,
      description: "AI-powered content generation",
    },
    {
      path: "/analytics",
      name: "Analytics",
      icon: BarChart3,
      description: "Instagram performance insights",
    },
    {
      path: "/content-bank",
      name: "Content Bank",
      icon: Bookmark,
      description: "Saved content ideas",
    },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Creator Platform
              </h1>
              <p className="text-xs text-gray-500">AI Content Assistant</p>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`
                  }
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* User Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-600">
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-2 pt-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`
                    }
                  >
                    <IconComponent className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </NavLink>
                );
              })}
            </div>

            {/* Mobile User Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="px-4 py-2 text-sm text-gray-600">
                Signed in as:{" "}
                {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
