import React from "react";
import { cn } from "@/libs/utils";
import { usePagerContext } from "@/libs/providers/pager-context";
import { getSlideNumber } from "@/libs/field-path";
import { useSelection } from "@/libs/hooks/use-selection";
import { useSelectionContext } from "@/libs/providers/selection-context";

export function PageBase({
  size,
  children,
  fieldName,
  className,
}: {
  size: { width: number; height: number };
  children: React.ReactNode;
  fieldName: string;
  className?: string;
}) {
  const { currentSelection } = useSelectionContext();
  const pageNumber = getSlideNumber(fieldName);

  return (
    <div
      id={"page-base-" + pageNumber}
      className={cn(
        "overflow-clip relative outline-2 outline-transparent ring-offset-background",
        currentSelection == fieldName &&
          "outline-input ring-2 ring-offset-2 ring-ring",
        className
      )}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        minWidth: `${size.width}px`,
        minHeight: `${size.height}px`,
      }}
    >
      {children}
    </div>
  );
}
