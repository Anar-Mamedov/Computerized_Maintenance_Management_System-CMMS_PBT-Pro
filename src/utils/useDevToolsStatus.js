import { useState, useEffect } from "react";
import { addListener, launch } from "devtools-detector";

export function useDevToolsStatus() {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // Check if we're on localhost:5173
    if (window.location.href === "http://localhost:5173/") {
      // Don't initialize devtools detection on localhost
      return;
    }

    function handleDevToolsChange(isOpen) {
      setIsDevToolsOpen(isOpen);
    }

    addListener(handleDevToolsChange);
    launch();

    return () => {
      // Cleanup not needed as library doesn't provide cleanup functions
    };
  }, []);

  // Always return false for localhost
  return window.location.href === "http://localhost:5173/" ? false : isDevToolsOpen;
}
