import { useEffect, useState } from "react";

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Prevent SSR errors — only run on client
    if (typeof window === "undefined") return;

    const checkSize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // Run once on mount
    checkSize();

    // Listen for resize
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, [breakpoint]);

  return isMobile;
}
