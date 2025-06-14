import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const URLCleaner = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    // Check for Clerk handshake parameters
    if (urlParams.has("__clerk_handshake")) {
      // Clean the URL immediately
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default URLCleaner;
