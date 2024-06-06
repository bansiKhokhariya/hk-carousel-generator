import React from "react";
import { cn } from "@/libs/utils";
import { usePagerContext } from "@/libs/providers/pager-context";
import { getParent, getSlideNumber } from "@/libs/field-path";
import { useSelection } from "@/libs/hooks/use-selection";
import { useSelectionContext } from "@/libs/providers/selection-context";

export function PageFrame({
  children,
  fieldName,
  className,
}: {
  children: React.ReactNode;
  fieldName: string;
  className?: string;
}) {
  const { setCurrentPage } = usePagerContext();
  const { setCurrentSelection } = useSelectionContext();
  const pageNumber = getSlideNumber(fieldName);

  return (
    <div
      className={cn("flex flex-col h-full w-full", className)}
      onClick={(event) => {
        setCurrentPage(pageNumber);
        setCurrentSelection(fieldName, event);
      }}
    >
      {children}
    </div>
  );
}
