import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex min-h-[700px]">
          {/* Left side - Image */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/col.png')`,
              }}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 via-pink-200/20 to-purple-300/20"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col justify-end p-8 text-white">
              {/* Logo/Brand */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-white/30 rounded-md backdrop-blur-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                  </div>
                  <span className="text-lg font-semibold">Streamline</span>
                </div>
              </div>

              {/* Bottom Text */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-sm opacity-90">
                  <span>Supported by</span>
                  <div className="flex flex-wrap items-center gap-3">
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
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-sm">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
