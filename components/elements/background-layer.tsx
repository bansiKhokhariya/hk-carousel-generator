import React from "react";
import { cn } from "@/libs/utils";

export function BackgroundLayer({
  background,
  className = "",
}: {
  background: string;
  className?: string;
}) {
  return (
    <div
      style={{
        backgroundColor: background,
      }}
      className={cn(
        "w-full h-full absolute top-0 left-0 right-0 bottom-0",
        className
      )}
    ></div>
  );
}
