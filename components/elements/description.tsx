import React from "react";
import { cn } from "@/libs/utils";
import { fontIdToClassName } from "@/libs/fonts-map";
import { textStyleToClasses } from "@/libs/text-style-to-classes";
import { useFormContext } from "react-hook-form";
import { TextAreaFormField } from "@/components/forms/fields/text-area-form-field";
import {
  DocumentFormReturn,
  TextFieldPath,
  TextFieldStyle,
  StyleFieldPath,
  TextTextFieldPath,
} from "@/libs/document-form-types";

export function Description({
  fieldName,
  className = "",
}: {
  fieldName: TextFieldPath;
  className?: string;
}) {
  const form: DocumentFormReturn = useFormContext();
  const { getValues } = form;
  const config = getValues("config");
  const style = getValues(
    `${fieldName}.style` as StyleFieldPath
  ) as TextFieldStyle;
  const textFieldName = (fieldName + ".text") as TextTextFieldPath;

  return (
    <TextAreaFormField
      fieldName={textFieldName}
      form={form}
      label={""}
      placeholder={"Your description here"}
      className={cn(
        `font-medium`,
        textStyleToClasses({
          style: style,
          sizes: ["text-xl", "text-lg", "text-base"],
        }),
        fontIdToClassName(config.fonts.font2),
        className
      )}
      style={{
        color: config.theme.secondary,
      }}
    />
  );
}
