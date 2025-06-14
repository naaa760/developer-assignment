import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import ContentIdeasPage from "./pages/ContentIdeasPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ContentBankPage from "./pages/ContentBankPage";
import DashboardPage from "./pages/DashboardPage";
import SignInPage from "./auth/SignInPage";
import SignUpPage from "./auth/SignUpPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import URLCleaner from "./components/URLCleaner";
import { Toaster } from "./components/Toaster";
import "./App.css";

// Get Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-lg text-gray-600">
            Loading Creator Platform...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <Router>
        <URLCleaner />
        <div className="min-h-screen">
          <Routes>
            {/* Test route */}
            <Route
              path="/test"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <h1 className="text-2xl">Test Route Works!</h1>
                </div>
              }
            />

            {/* Public routes for authentication */}
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/content-ideas"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                    <Navigation />
                    <main className="container mx-auto px-4 py-8">
                      <ContentIdeasPage />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                    <Navigation />
                    <main className="container mx-auto px-4 py-8">
                      <AnalyticsPage />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/content-bank"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                    <Navigation />
                    <main className="container mx-auto px-4 py-8">
                      <ContentBankPage />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Root route redirects */}
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <Navigate to="/dashboard" replace />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/sign-in" replace />
                  </SignedOut>
                </>
              }
            />

            {/* Catch all route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                      404 - Page Not Found
                    </h1>
                    <p className="text-gray-600 mb-4">
                      The page you're looking for doesn't exist.
                    </p>
                    <p className="text-sm text-gray-500">
                      Current path: {window.location.pathname}
                    </p>
                    <a
                      href="/sign-in"
                      className="text-blue-600 hover:underline"
                    >
                      Go to Sign In
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>

          <Toaster />
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
