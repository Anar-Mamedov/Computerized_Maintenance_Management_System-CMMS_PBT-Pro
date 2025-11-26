import { useState, useEffect } from "react";
import { addListener, launch } from "devtools-detector";

export function useDevToolsStatus() {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  useEffect(() => {
    // Development/test domains whitelist
    const allowedDomains = ["localhost", "127.0.0.1", "pbtpro.netlify.app"];
    const isAllowedDomain = allowedDomains.includes(window.location.hostname);

    console.log("DevTools Detector - Domain:", window.location.hostname);
    console.log("DevTools Detector - Is Allowed:", isAllowedDomain);

    const handleDevToolsChange = (isOpen) => {
      console.log("DevTools Detector - Status changed:", isOpen);
      setIsDevToolsOpen(isOpen);
    };

    if (!isAllowedDomain) {
      // Wait 2 seconds before initial check to avoid false positives during page load
      const initialDelay = setTimeout(() => {
        setInitialCheckComplete(true);
        console.log("DevTools Detector - Initial check enabled");
      }, 2000);

      addListener(handleDevToolsChange);
      launch();

      return () => {
        clearTimeout(initialDelay);
      };
    } else {
      console.log("DevTools Detector - Disabled for this domain");
    }

    return () => {
      // Cleanup not needed as library doesn't provide cleanup functions
    };
  }, []);

  // Development/test domains whitelist
  const allowedDomains = ["localhost", "127.0.0.1", "pbtpro.netlify.app"];
  const isAllowedDomain = allowedDomains.includes(window.location.hostname);

  // Return false for allowed domains or during initial 2-second grace period
  if (isAllowedDomain || !initialCheckComplete) {
    return false;
  }

  return isDevToolsOpen;
}
