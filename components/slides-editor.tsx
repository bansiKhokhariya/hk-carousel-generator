import { useFieldArray, useFormContext } from "react-hook-form";
import {
  DocumentFormReturn,
  SlidesFieldArrayReturn,
} from "@/libs/document-form-types";
import { Document } from "./pages/document";
import useWindowDimensions from "@/libs/hooks/use-window-dimensions";
import { SIZE } from "@/libs/page-size";
import { LoadingSpinner } from "./loading-spinner";
import { usePagerContext } from "@/libs/providers/pager-context";
import { useFieldArrayValues } from "@/libs/hooks/use-field-array-values";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelectionContext } from "@/libs/providers/selection-context";
import { AIInputForm } from "@/components/ai-input-form";
import { AITextAreaForm } from "@/components/ai-textarea-form";
import { useKeys } from "@/libs/hooks/use-keys";
import { NoApiKeysText } from "./no-api-keys-text";
import { useKeysContext } from "@/libs/providers/keys-context";
import { AIPanel } from "@/components/ai-panel";
import { useEffect, useState } from "react";
import { useStatusContext } from "@/libs/providers/editor-status-context";
import { DocumentSkeleton } from "@/components/editor-skeleton";
import { useSession, signOut } from "next-auth/react";

interface SlidesEditorProps { }

export function SlidesEditor({ }: SlidesEditorProps) {
  const form: DocumentFormReturn = useFormContext();
  const { control, watch } = form;
  const document = watch();
  const { width } = useWindowDimensions();
  const windowWidth = width || 0;
  const isLoadingWidth = !windowWidth;
  const { currentPage, onPreviousClick, onNextClick, setCurrentPage } =
    usePagerContext();
  const { numPages } = useFieldArrayValues("slides");
  const slidesFieldArray: SlidesFieldArrayReturn = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "slides", // unique name for your Field Array
  });
  const { setCurrentSelection } = useSelectionContext();
  const { status, setStatus } = useStatusContext();
  const { data: session } = useSession();
  const [islogin, setIsLogin] = useState(null);

  useEffect(() => {
    setStatus("ready");
  }, [setStatus]);

  useEffect(() => {
    if (!session?.user) {
      setIsLogin(session?.user);
    }
  }, [session]);

  // Screen with larger than md side have smaller slides because the sidebar is present
  const mdWindowWidthPx = 770;
  const screenToSlideMinRatio = windowWidth > mdWindowWidthPx ? 2.5 : 1.2;
  const scale = Math.min(1, windowWidth / screenToSlideMinRatio / SIZE.width);

  return (
    <div
      className="flex flex-col w-full items-center justify-start bg-muted/20 flex-1 h-full"
      onClick={(event) => {
        setCurrentSelection("", event);
      }}
    >
      <div className=" flex flex-col p-4 w-full h-full items-center justify-start gap-8 font-mono text-sm bg-muted">
        <div className="w-full px-4 py-10">
          {isLoadingWidth || status == "loading" ? (
            <DocumentSkeleton />
          ) : (
            <Document
              document={document}
              slidesFieldArray={slidesFieldArray}
              scale={scale}
            />
          )}
        </div>
        {islogin && <AIPanel />}
      </div>
    </div>
  );
}
