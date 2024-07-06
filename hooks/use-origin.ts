"use client";

import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [origin, serOrigin] = useState("");

  // const origin =
  //   window && window?.location.origin !== undefined && window.location.origin
  //     ? window.location.origin
  //     : "";

  useEffect(() => {
    setIsMounted(true);
    serOrigin(window.location.origin);
  }, []);

  if (!isMounted) return null;

  return origin;
};
