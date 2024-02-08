"use client";

import { Skill } from "@prisma/client";

import { capitalize, cn } from "@/lib/utils";

import { FormFieldsType } from "@/lib/types";
import { useField } from "formik";

import slugify from "@sindresorhus/slugify";
import AsyncCreatableSelect from "react-select/async-creatable";

interface SkillAutocompleteProps extends FormFieldsType {
  setFieldValue: any;
  siteId?: string;
  projectId?: string;
}

const ProjectCategories = ({
  setFieldValue,
  containerClasses,
  siteId,
  projectId,
  ...props
}: SkillAutocompleteProps) => {
  const [field, meta] = useField(props);

  const ascFilter = (a?: Skill, b?: Skill): boolean =>
    a?.name.toLowerCase() === b?.name.toLowerCase();

  const getProjectCategories = async (inputValue: string) => {
    console.log(inputValue);
    const res = await fetch(
      `/api/builder/${siteId}/project/${projectId}/category`,
    );
    const data = await res.json();
    return data.sort(ascFilter);
  };

  const createCategory = async (inputValue: string) => {
    console.log(inputValue);
    const slug = slugify(inputValue);
    const name = capitalize(inputValue);

    setFieldValue(field.name, {
      slug,
      name,
    });
  };

  return (
    <div className={cn("flex flex-col text-sm", containerClasses)}>
      <AsyncCreatableSelect
        cacheOptions
        defaultOptions
        isClearable
        allowCreateWhileLoading
        classNamePrefix="select-content"
        onCreateOption={createCategory}
        className="select-component"
        loadOptions={getProjectCategories}
        {...field}
        {...props}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.slug}
        value={field.value}
        onChange={(option) => {
          setFieldValue(field.name, option);
        }}
        getNewOptionData={(inputValue, optionLabel) => ({
          name: optionLabel,
          slug: inputValue,
        })}
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
};

export default ProjectCategories;
