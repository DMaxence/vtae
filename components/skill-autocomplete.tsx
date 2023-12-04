"use client";
import React from "react";

import { Combobox } from "@headlessui/react";
import useSWR from "swr";

import { useSession } from "next-auth/react";

import { Experience, Skill } from "@prisma/client";

import { cn, fetcher } from "@/lib/utils";

import Highlighted from "@/components/highlighted";
import { FormFieldsType } from "@/lib/types";
import { useField } from "formik";
import { Search, XCircle } from "lucide-react";
import LoadingSpinner from "./icons/loading-spinner";
import { useDebounce, useDebouncedCallback } from "use-debounce";

import AsyncCreatableSelect from "react-select/async-creatable";

interface SkillAutocompleteProps extends FormFieldsType {
  skills?: Array<Skill>;
  setFieldValue: any;
  experienceId?: string;
  experience?: Experience & {
    skills: Skill[];
  };
}

const Skill = ({ skill, removeSkill }: { skill: Skill; removeSkill: any }) => {
  return (
    <>
      <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-normal text-gray-500 dark:border-none dark:bg-gray-300 dark:text-gray-600">
        {skill.name}
        <button
          type="button"
          className="ml-1.5"
          onClick={() => removeSkill(skill)}
        >
          <XCircle className="h-5 w-5 text-gray-500" />
        </button>
      </span>
      <input type="hidden" name="skills" value={skill.id} />
    </>
  );
};

const SkillAutocomplete = ({
  skills,
  setFieldValue,
  experienceId,
  experience,
  ...props
}: SkillAutocompleteProps) => {
  const [_, meta] = useField(props);

  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const [selectedSkills, setSelectedSkills] = React.useState<Array<Skill>>(
    skills || [],
  );
  const [query, setQuery] = React.useState("");
  const [debouncedQuery] = useDebounce(query, 250);

  const { data: fetchedSkills, error } = useSWR<Array<Skill>>(
    sessionId && `/api/builder/skill?q=${debouncedQuery}`,
    fetcher,
  );
  const isLoading = !error && !fetchedSkills;

  const ascFilter = (a?: Skill, b?: Skill): boolean =>
    a?.name.toLowerCase() === b?.name.toLowerCase();

  const handleSelect = (skill: Skill) => {
    setSelectedSkills([...selectedSkills, skill]);
    setQuery("");
  };

  const filteredSkills = fetchedSkills
    ?.filter((skill) => !selectedSkills.some((s) => s.id === skill.id))
    .map((skill) => ({ ...skill, value: skill.id, label: skill.name }));

  const removeSkill = (skill: Skill) =>
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));

  React.useEffect(() => {
    const newSkillsValues = selectedSkills.map((skill) => skill.id);
    if (experienceId) {
      const removeSkills = experience?.skills
        ?.filter((skill) => !newSkillsValues.includes(skill.id))
        ?.map((skill) => skill.id);
      setFieldValue("removeSkills", removeSkills);
    }
    setFieldValue("skills", newSkillsValues);
  }, [setFieldValue, experienceId, experience, selectedSkills]);

  const getSkills = useDebouncedCallback(async (inputValue: string) => {
    const res = await fetch(`/api/builder/skill?q=${inputValue}`);
    const data = await res.json();
    return data.map((skill: Skill) => ({
      ...skill,
      value: skill.id,
      label: skill.name,
    }));
  }, 200);

  return (
    <div className="flex w-full flex-col">
      {/* <AsyncCreatableSelect
        cacheOptions
        defaultOptions
        classNamePrefix="select-content"
        className="select-component w-full"
        loadOptions={getSkills}
        components={{
          Option: ({ data, ...props }) => (
            <div className="flex items-center px-5 py-3" {...props}>
              <span className="block truncate font-normal">
                <Highlighted text={data.label} highlight={query} />
              </span>
            </div>
          ),
        }}
      /> */}
      <Combobox
        by={ascFilter}
        onChange={handleSelect}
        as="div"
        className="max-w-x1 shadow-2x1 relative w-full rounded-lg bg-white ring-1 ring-black/5 dark:bg-stone-700 "
      >
        <div className="flex w-full items-center rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus-within:border-blue-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
          <Search className="mr-2 h-5 w-5 text-gray-400" />
          <Combobox.Input
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
            className="w-full border-none p-0 text-sm placeholder-gray-300 focus:ring-0 dark:bg-stone-700"
            placeholder="Search for a skill"
          />
          {isLoading && <LoadingSpinner />}
        </div>

        <Combobox.Options
          className={cn(
            "absolute z-[1001] max-h-56 w-full divide-y divide-gray-200 overflow-y-auto rounded-b-lg border border-t-0 border-gray-300 bg-white dark:bg-stone-700",
            !filteredSkills?.length ? "border-0" : "",
          )}
        >
          {filteredSkills?.map((skill) => (
            <Combobox.Option key={skill.id} value={skill}>
              <div className="flex items-center px-5 py-3">
                <span className="block truncate font-normal">
                  <Highlighted text={skill.name} highlight={query} />
                </span>
              </div>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
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

      <div className="mt-2 flex flex-wrap gap-2">
        {selectedSkills.map((skill) => (
          <Skill key={skill.id} skill={skill} removeSkill={removeSkill} />
        ))}
      </div>
    </div>
  );
};

export default SkillAutocomplete;
