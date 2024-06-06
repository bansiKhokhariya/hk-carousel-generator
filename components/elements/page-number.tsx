import React from "react";
import { ConfigSchema } from "@/libs/validation/document-schema";
import { z } from "zod";
import { cn } from "@/libs/utils";
import { fontIdToClassName } from "@/libs/fonts-map";

export function PageNumber({
  config,
  number,
  className,
}: {
  config: z.infer<typeof ConfigSchema>;
  number: number;
  className?: string;
}) {
  // TODO: Use the view to optionally add a circle around it
  return (
    <div className={`flex flex-row gap-3 items-center ${cn(className)}`}>
      <p
        className={cn(`text-xl`, fontIdToClassName(config.fonts.font2))}
        style={{
          color: config.theme.primary,
        }}
      >
        {number}
      </p>
    </div>
  );
}
