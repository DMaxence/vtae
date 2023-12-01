"use client";

import { useField } from "formik";

import { FormFieldsType } from "@/lib/types";

import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export default function TextArea({
  containerClasses,
  ...props
}: FormFieldsType) {
  const [field, meta] = useField(props);
  return (
    <div
      className={cn(
        "flex flex-col items-start text-sm",
        containerClasses ? containerClasses : "",
      )}
    >
      <div className="relative w-full">
        <textarea
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-300 focus:outline-none focus:ring-0 dark:bg-stone-700"
          rows={6}
          {...field}
          {...props}
          required={false}
        />
        <span className="absolute bottom-0 right-0 mb-2 mr-1 text-xs text-gray-600 dark:text-gray-300">
          {field.value.length}/{props?.maxLength || 1000}
        </span>
        {meta.error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <AlertCircle className="text-xl text-red-500" />
          </div>
        )}
      </div>
      <div className="mt-1">
        {props.helperText && (
          <p className="text-xs text-gray-500 dark:text-gray-200">
            {props.helperText}
          </p>
        )}
        {meta.error && (
          <span className="text-sm text-red-500">{meta.error as string}</span>
        )}
      </div>
    </div>
  );
}
