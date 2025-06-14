import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { cleanClerkParams } from "../utils/urlCleanup";

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  // Clean up URL parameters after successful authentication
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      cleanClerkParams();
    }
  }, [isLoaded, isSignedIn, location]);

  // Show loading spinner while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Render protected content if authenticated
  return children;
};

export default ProtectedRoute;
