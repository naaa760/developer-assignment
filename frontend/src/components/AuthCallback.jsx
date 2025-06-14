import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const AuthCallback = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Clean up URL parameters after successful authentication
      const urlParams = new URLSearchParams(location.search);

      // Check if there are Clerk handshake parameters
      if (
        urlParams.has("__clerk_handshake") ||
        urlParams.has("__clerk_status")
      ) {
        // Clean the URL and redirect to dashboard
        window.history.replaceState({}, document.title, "/dashboard");
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isLoaded, isSignedIn, navigate, location]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-lg text-gray-600">Completing sign in...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
