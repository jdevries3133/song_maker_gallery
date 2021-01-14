import React, { useEffect, useState } from "react";

/* If breakpoint is provided, only return a change when it is crossed */
export default function useWidth(breakpoint) {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleWindowResize = () => {
      if (breakpoint) {
        if (
          (width > breakpoint && window.innerWidth < breakpoint) ||
          (width < breakpoint && window.innerWidth > breakpoint)
        ) {
          setWidth(window.innerWidth);
        }
      } else {
        setWidth(window.innerWidth);
      }
    };
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [window.innerWidth]);
  return { width };
}
