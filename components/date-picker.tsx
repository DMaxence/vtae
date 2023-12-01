"use client";
import React from "react";

import { FormFieldsType } from "@/lib/types";

import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { useField } from "formik";

export default function DatePicker({
  containerClasses,
  ...props
}: FormFieldsType) {
  const [field, meta, helper] = useField(props);
  const _input = React.useRef<HTMLInputElement>(null);

  const setDateType = () => {
    if (_input.current && !_input.current.value) {
      _input.current.type = props.type;
      _input.current.showPicker();
    }
  };

  const setTextType = () => {
    if (_input.current && !_input.current.value) {
      _input.current.type = "text";
    }
  };

  React.useEffect(() => {
    if (_input.current) {
      if (!_input.current.value) {
        _input.current.type = "text";
      }
    }
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-start text-sm",
        containerClasses ? containerClasses : "",
      )}
    >
      <input
        ref={_input}
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
        onClick={setDateType}
        onBlur={setTextType}
        value={
          field.value
            ? format(
                new Date(field.value),
                props.type === "date" ? "yyyy-MM-dd" : "yyyy-MM",
              )
            : ""
        }
        // TODO : Fix this because I don't know why I need to specify it's type
        type="text"
        required={false}
        autoComplete="off"
      />
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
