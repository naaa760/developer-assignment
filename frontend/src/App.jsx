import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import ContentIdeasPage from "./pages/ContentIdeasPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ContentBankPage from "./pages/ContentBankPage";
import DashboardPage from "./pages/DashboardPage";
import TestPage from "./pages/TestPage";
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
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <URLCleaner />
        <div className="min-h-screen">
          <Routes>
            {/* Test route */}
            <Route path="/test" element={<TestPage />} />

            {/* Public auth routes - NO protection */}
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <DashboardPage />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/content-ideas"
              element={
                <>
                  <SignedIn>
                    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                      <Navigation />
                      <main className="container mx-auto px-4 py-8">
                        <ContentIdeasPage />
                      </main>
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/analytics"
              element={
                <>
                  <SignedIn>
                    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                      <Navigation />
                      <main className="container mx-auto px-4 py-8">
                        <AnalyticsPage />
                      </main>
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/content-bank"
              element={
                <>
                  <SignedIn>
                    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                      <Navigation />
                      <main className="container mx-auto px-4 py-8">
                        <ContentBankPage />
                      </main>
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />

            {/* Root route */}
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

            {/* Catch all */}
            <Route
              path="*"
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
          </Routes>

          <Toaster />
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
