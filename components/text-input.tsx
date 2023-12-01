"use client";

import { FormFieldsType } from "@/lib/types";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useField } from "formik";
import { AlertCircle } from "lucide-react";

export default function TextInput({
  containerClasses,
  ...props
}: FormFieldsType) {
  const [field, meta, helper] = useField(props);
  return (
    <div
      className={cn(
        "flex flex-col items-start text-sm",
        containerClasses ? containerClasses : "",
      )}
    >
      <div className="relative w-full">
        <input
          className={cn(
            props.readOnly
              ? "cursor-not-allowed border-gray-300 bg-gray-100 focus:border-gray-300 focus:ring-0 dark:bg-stone-500"
              : meta.error
                ? "border-red-500 placeholder-red-300 focus:border-red-500 focus:ring-red-500 dark:bg-stone-700"
                : "border-gray-300 bg-white placeholder-gray-300 focus:outline-none focus:ring-0 dark:bg-stone-700",
            "w-full rounded-lg border px-3 py-2 text-sm",
          )}
          {...field}
          {...props}
          {...(props.type === "date" && {
            value: field.value
              ? format(new Date(field.value), "yyyy-MM-dd")
              : "",
          })}
          autoComplete="off"
          required={false}
        />
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
