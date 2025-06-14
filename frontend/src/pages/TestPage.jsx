import React from "react";

const TestPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
            🎉 ROUTING WORKS!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            If you can see this page, the routing is working correctly.
          </p>
          <div className="space-y-4">
            <a
              href="/sign-up"
              className="block w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              Go to Sign Up
            </a>
            <a
              href="/sign-in"
              className="block w-full bg-white border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Go to Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
