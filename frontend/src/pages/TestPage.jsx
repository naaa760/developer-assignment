import React from "react";

const TestPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🎉 ROUTING WORKS!
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          If you can see this page, the routing is working correctly.
        </p>
        <div className="space-x-4">
          <a
            href="/sign-up"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Sign Up
          </a>
          <a
            href="/sign-in"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
