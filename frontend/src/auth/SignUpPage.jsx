import React from "react";
import { SignUp } from "@clerk/clerk-react";
import AuthLayout from "./AuthLayout";

const SignUpPage = () => {
  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600">Join us and start your journey</p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="space-y-6">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 p-0 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-3 px-4 flex items-center justify-center space-x-2 transition-colors duration-200",
                socialButtonsBlockButtonText: "font-medium",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500 text-sm",
                formFieldInput:
                  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200",
                formFieldLabel: "text-sm font-medium text-gray-700 mb-2",
                formButtonPrimary:
                  "w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]",
                footerActionLink:
                  "text-orange-500 hover:text-orange-600 font-medium",
                identityPreviewText: "text-gray-600",
                identityPreviewEditButton:
                  "text-orange-500 hover:text-orange-600",
                formFieldInputShowPasswordButton:
                  "text-gray-500 hover:text-gray-700",
                otpCodeFieldInput:
                  "border-gray-300 focus:ring-orange-500 focus:border-orange-500",
                formFieldSuccessText: "text-green-600",
                formFieldErrorText: "text-red-600",
                alertClerkError:
                  "text-red-600 bg-red-50 border border-red-200 rounded-lg p-3",
                formFieldHintText: "text-gray-500 text-sm",
                formFieldWarningText: "text-amber-600",
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false,
              },
            }}
            afterSignUpUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>

        {/* Additional Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;
