"use client";

import { FormFieldsType } from "@/lib/types";

import { cn } from "@/lib/utils";

import { useField } from "formik";
import SelectComponent from "react-select";

export default function Select({
  ...props
}: FormFieldsType & {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}) {
  const [field, meta] = useField(props);
  return (
    <div
      className={cn(
        "flex flex-col items-start text-sm",
        props.containerClasses ? props.containerClasses : "",
      )}
    >
      <SelectComponent
        options={props.selectOptions}
        // isSearchable={false}
        classNamePrefix="select-content"
        {...field}
        {...props}
        className="select-component w-full"
        value={props.selectOptions?.find(
          (option) => option.value === field.value,
        )}
        onChange={(option) => props.setFieldValue(field.name, option?.value)}
        required={false}
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
