import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Main Card Container */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex min-h-[600px]">
          {/* Left side - Image/Gradient */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-pink-200 to-purple-300"></div>

            {/* Abstract Geometric Shapes */}
            <div className="absolute inset-0">
              {/* Large Triangle */}
              <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-orange-300/30 to-pink-300/30 transform rotate-45 rounded-3xl"></div>

              {/* Medium Circle */}
              <div className="absolute bottom-32 right-16 w-64 h-64 bg-gradient-to-br from-pink-300/40 to-purple-300/40 rounded-full"></div>

              {/* Small Triangle */}
              <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-pink-400/20 transform -rotate-12 rounded-2xl"></div>

              {/* Floating Elements */}
              <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm"></div>
              <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-white/15 rounded-lg backdrop-blur-sm transform rotate-45"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col justify-end p-12 text-white">
              {/* Logo/Brand */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                  <span className="text-xl font-semibold">Streamline</span>
                </div>
              </div>

              {/* Bottom Text */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm opacity-80">
                  <span>Supported by</span>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">CISCO</span>
                    <span className="font-medium">Starbucks</span>
                    <span className="font-medium">Deloitte</span>
                    <span className="font-medium">McDonalds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
