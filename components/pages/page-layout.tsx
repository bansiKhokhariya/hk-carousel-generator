import React from "react";
import { cn } from "@/libs/utils";
import { usePagerContext } from "@/libs/providers/pager-context";
import { getSlideNumber } from "@/libs/field-path";
import { useSelection } from "@/libs/hooks/use-selection";
import { useSelectionContext } from "@/libs/providers/selection-context";

export function PageLayout({
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
      className={cn(
        "flex flex-col justify-center grow items-stretch",
        className
      )}
      onClick={(event) => {
        setCurrentPage(pageNumber);
        setCurrentSelection(fieldName, event);
      }}
    >
      {children}
    </div>
  );
}
