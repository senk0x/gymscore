import { useEffect, useState } from "react";

/**
 * Returns true if the screen width is at least 640px (sm breakpoint).
 */
export function useIsWideScreen(): boolean {
  const [isWide, setIsWide] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth >= 640 : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 640px)");
    const handleChange = () => setIsWide(mq.matches);
    handleChange();
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return isWide;
} 