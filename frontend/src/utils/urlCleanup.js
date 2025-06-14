import { useEffect } from "react";

/**
 * Clean up Clerk authentication parameters from the URL
 * This prevents the long handshake parameters from staying in the URL after login
 */
export const cleanClerkParams = () => {
  const urlParams = new URLSearchParams(window.location.search);

  // List of Clerk parameters to remove
  const clerkParams = [
    "__clerk_handshake",
    "__clerk_status",
    "__clerk_db_jwt",
    "__clerk_redirect_url",
    "__clerk_created_session",
    "__clerk_synced",
  ];

  let hasClerkParams = false;

  // Check if any Clerk parameters exist
  clerkParams.forEach((param) => {
    if (urlParams.has(param)) {
      hasClerkParams = true;
    }
  });

  // If Clerk parameters exist, clean the URL
  if (hasClerkParams) {
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    return true;
  }

  return false;
};

/**
 * Hook to automatically clean Clerk parameters on component mount
 */
export const useClerkUrlCleanup = () => {
  useEffect(() => {
    cleanClerkParams();
  }, []);
};
