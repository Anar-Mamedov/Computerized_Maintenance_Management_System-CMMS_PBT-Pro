// useDebouncedEffect.js
import { useEffect } from "react";

// Export the hook
export function useDebouncedEffect(effect, deps, delay) {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    // Cleanup function to cancel the timeout if deps change
    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
}
