import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Creator Platform
          </h1>
          <p className="text-gray-600">
            AI Content Assistant & Instagram Analytics
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
