"use client";
import React from "react";

import useSWR from "swr";

import { useSession } from "next-auth/react";

import { Skill } from "@prisma/client";

import { capitalize, fetcher } from "@/lib/utils";

import { FormFieldsType } from "@/lib/types";
import { useField } from "formik";
import { XCircle } from "lucide-react";
import { useDebounce } from "use-debounce";

import { nanoid } from "@/utils";
import { SingleValue } from "react-select";
import AsyncCreatableSelect from "react-select/creatable";

interface SkillAutocompleteProps extends FormFieldsType {
  skills?: Array<Skill>;
  setFieldValue: any;
  exists?: boolean;
  existingSkills?: Array<Skill>;
  canDeleteExisting?: boolean;
}

const Skill = ({
  skill,
  removeSkill,
  canDelete,
}: {
  skill: Skill;
  removeSkill: any;
  canDelete: boolean;
}) => {
  return (
    <>
      <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-normal text-gray-500 dark:border-none dark:bg-gray-300 dark:text-gray-600">
        {skill.name}
        {canDelete && (
          <button
            type="button"
            className="ml-1.5"
            onClick={() => removeSkill(skill)}
          >
            <XCircle className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </span>
      <input type="hidden" name="skills" value={skill.id} />
    </>
  );
};

const SkillAutocomplete = ({
  skills,
  setFieldValue,
  exists,
  existingSkills,
  canDeleteExisting = true,
  ...props
}: SkillAutocompleteProps) => {
  const [_, meta] = useField(props);

  const { status } = useSession();

  const [selectedSkills, setSelectedSkills] = React.useState<Array<Skill>>(
    skills || [],
  );
  const [query, setQuery] = React.useState("");
  const [debouncedQuery] = useDebounce(query, 250);

  const {
    data: fetchedSkills,
    error,
    isLoading,
  } = useSWR<Array<Skill>>(
    status === "authenticated" &&
      `/api/builder/skill?q=${encodeURIComponent(debouncedQuery)}`,
    fetcher,
  );

  const handleSelect = (skill: SingleValue<Skill>) => {
    if (!skill || selectedSkills.find((s) => s.name === skill.name)) return;
    setSelectedSkills([...selectedSkills, skill as Skill]);
  };

  const removeSkill = (skill: Skill) =>
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));

  React.useEffect(() => {
    const newSkillsValues = selectedSkills.map((skill) => skill.id);
    if (exists) {
      const removeSkills = existingSkills
        ?.filter((skill) => !newSkillsValues.includes(skill.id))
        ?.map((skill) => skill.id);
      setFieldValue("removeSkills", removeSkills);
    }
    setFieldValue("skills", selectedSkills);
  }, [setFieldValue, exists, existingSkills, selectedSkills]);

  const createSkill = async (inputValue: string) => {
    const name = capitalize(inputValue);
    if (selectedSkills.find((s) => s.name === name)) return;
    setSelectedSkills([
      ...selectedSkills,
      {
        id: nanoid(),
        name,
      } as Skill,
    ]);
  };

  return (
    <div className="flex w-full flex-col">
      <AsyncCreatableSelect
        isSearchable
        allowCreateWhileLoading
        classNamePrefix="select-content"
        onCreateOption={createSkill}
        className="select-component"
        options={fetchedSkills}
        {...props}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.id}
        value={null as unknown as Skill}
        onChange={handleSelect}
        onInputChange={(inputValue) => setQuery(inputValue)}
        getNewOptionData={(inputValue, optionLabel) =>
          ({
            name: optionLabel,
            id: inputValue,
          }) as Skill
        }
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

      <div className="mt-2 flex flex-wrap gap-2">
        {selectedSkills.map((skill) => (
          <Skill
            key={skill.id}
            skill={skill}
            removeSkill={removeSkill}
            canDelete={
              canDeleteExisting ||
              !!existingSkills?.find((s) => s.id === skill.id) ||
              !skills?.find((s) => s.id === skill.id)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default SkillAutocomplete;
