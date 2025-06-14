import React from "react";
import { SignUp } from "@clerk/clerk-react";
import AuthLayout from "./AuthLayout";

const SignUpPage = () => {
  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600">Join us and start your journey</p>
        </div>

        {/* Clerk Sign Up Component */}
        <div>
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 p-0 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "w-full bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl py-3 px-4 flex items-center justify-center space-x-2 transition-all duration-200 font-medium",
                socialButtonsBlockButtonText: "font-medium text-gray-700",
                socialButtonsBlockButtonArrow: "text-gray-500",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500 text-sm font-medium",
                formFieldInput:
                  "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white",
                formFieldLabel: "text-sm font-semibold text-gray-700 mb-2",
                formButtonPrimary:
                  "w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl",
                footerActionLink:
                  "text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-200",
                identityPreviewText: "text-gray-600",
                identityPreviewEditButton:
                  "text-orange-500 hover:text-orange-600 font-medium",
                formFieldInputShowPasswordButton:
                  "text-gray-400 hover:text-gray-600",
                otpCodeFieldInput:
                  "border-gray-200 focus:ring-orange-500 focus:border-orange-500 rounded-xl",
                formFieldSuccessText: "text-green-600 font-medium",
                formFieldErrorText: "text-red-600 font-medium",
                alertClerkError:
                  "text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 font-medium",
                formFieldHintText: "text-gray-500 text-sm",
                formFieldWarningText: "text-amber-600 font-medium",
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
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-200"
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
