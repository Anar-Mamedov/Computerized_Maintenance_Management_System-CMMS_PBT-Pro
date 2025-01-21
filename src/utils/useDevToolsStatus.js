import { useState, useEffect } from "react";
import { addListener, launch } from "devtools-detector";

export function useDevToolsStatus() {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // Check if running on localhost
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "pbtpro.netlify.app";

    if (!isLocalhost) {
      function handleDevToolsChange(isOpen) {
        setIsDevToolsOpen(isOpen);
      }

      addListener(handleDevToolsChange);
      launch();
    }

    return () => {
      // Cleanup not needed as library doesn't provide cleanup functions
    };
  }, []);

  // Return false for localhost, otherwise return actual status
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "pbtpro.netlify.app" ? false : isDevToolsOpen;
}
