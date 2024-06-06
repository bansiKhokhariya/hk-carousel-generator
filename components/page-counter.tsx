"use client";

import { useFieldArrayValues } from "@/libs/hooks/use-field-array-values";
import { usePagerContext } from "@/libs/providers/pager-context";
import { useEffect, useState } from "react";

export function PageCounter() {
  const [isClient, setIsClient] = useState(false);

  const { currentPage } = usePagerContext();
  const { numPages } = useFieldArrayValues("slides");
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <p className="px-2 " suppressHydrationWarning>
      {isClient
        ? `Slide ${Math.min(currentPage + 1, numPages)} / ${numPages}`
        : ""}
    </p>
  );
}
