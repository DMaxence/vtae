import { EmploymentType, FormFieldsType } from "@/lib/types";
import { countryCodeToDisplayLanguageMap } from "./countryCodeToDisplayLanguageMap";
import { countryCodeToDisplayNameMap } from "./countryCodeToDisplayNameMap";
import { countryCodeToFlagMap } from "./countryCodeToFlagMap";

export const personalInfosFields: FormFieldsType[] = [
  {
    name: "firstname",
    placeholder: "First Name",
    type: "text",
    required: true,
  },
  {
    name: "lastname",
    placeholder: "Last Name",
    type: "text",
    required: true,
  },
  {
    name: "title",
    placeholder: "Job title",
    type: "text",
  },
  {
    name: "alias",
    placeholder: "Alias",
    type: "text",
  },
];

export const aboutFields: FormFieldsType[] = [
  {
    name: "about",
    placeholder: `Add a short description about yourself`,
    type: "text",
    maxLength: 1000,
  },
];

export const currentInfosFields: FormFieldsType[] = [
  {
    name: "location",
    placeholder: "Your current location",
    type: "text",
  },
  {
    name: "currentWork",
    placeholder: "Your current job",
    type: "text",
  },
];

export const experienceFields: FormFieldsType[] = [
  {
    name: "companyName",
    placeholder: "Company Name",
    type: "text",
    required: true,
    containerClasses: "pr-1.5 w-1/2",
  },
  {
    name: "companyUrl",
    placeholder: "Company URL",
    type: "text",
    required: true,
    containerClasses: "pl-1.5 w-1/2",
  },
  {
    name: "jobTitle",
    placeholder: "Job Title",
    type: "text",
    required: true,
    containerClasses: "pr-1.5 w-1/2",
  },
  {
    name: "type",
    placeholder: "Experience Type",
    type: "select",
    selectOptions: (
      Object.keys(EmploymentType) as Array<keyof typeof EmploymentType>
    ).map((key) => ({ value: key, label: EmploymentType[key] })),
    required: true,
    containerClasses: "pl-1.5 w-1/2",
  },
  {
    name: "startDate",
    placeholder: "Start Date",
    type: "date",
    required: true,
    containerClasses: "pr-1.5 w-1/2",
  },
  {
    name: "endDate",
    placeholder: "End Date",
    type: "date",
    containerClasses: "pl-1.5 w-1/2",
  },
  {
    name: "location",
    placeholder: "Location",
    type: "text",
    containerClasses: "pr-1.5 w-1/2",
  },
  {
    name: "description",
    placeholder: "Description",
    type: "textarea",
    required: true,
    containerClasses: "w-full",
  },
  {
    name: "skills",
    placeholder: "Skills",
    type: "skills",
    containerClasses: "w-full",
  },
];
export const projectFields: FormFieldsType[] = [
  {
    name: "title",
    placeholder: "Project Title",
    type: "text",
    required: true,
    containerClasses: "pr-1.5 w-1/2",
  },
  {
    name: "url",
    placeholder: "Project URL",
    type: "text",
    required: true,
    containerClasses: "pl-1.5 w-1/2",
  },
  {
    name: "type",
    placeholder: "Type",
    type: "select",
    selectOptions: (
      Object.keys(EmploymentType) as Array<keyof typeof EmploymentType>
    ).map((key) => ({ value: key, label: EmploymentType[key] })),
    required: true,
    containerClasses: "pr-1.5 w-1/2",
  },
  {
    name: "category",
    placeholder: "Category",
    type: "projectCategories",
    containerClasses: "pl-1.5 w-1/2",
  },
  {
    name: "startDate",
    placeholder: "Start Date",
    type: "date",
    required: true,
    containerClasses: "pr-1.5 w-1/2",
  },
  {
    name: "endDate",
    placeholder: "End Date",
    type: "date",
    containerClasses: "pl-1.5 w-1/2",
  },
  {
    name: "description",
    placeholder: "Description",
    type: "textarea",
    required: true,
    containerClasses: "w-full",
  },
  {
    name: "skills",
    placeholder: "Skills",
    type: "skills",
    containerClasses: "w-full",
  },
  {
    name: "medias",
    placeholder: "Medias",
    type: "medias",
    containerClasses: "w-full",
  },
];

export const educationFields: FormFieldsType[] = [
  {
    name: "place",
    placeholder: "Insitution",
    type: "text",
    required: true,
    containerClasses: "w-full",
  },
  {
    name: "degree",
    placeholder: "Degree",
    type: "text",
    required: true,
    containerClasses: "pr-1.5 w-1/2",
  },
  {
    name: "degreeField",
    placeholder: "Degree Field",
    type: "text",
    required: true,
    containerClasses: "pl-1.5 w-1/2",
  },
  {
    name: "country",
    placeholder: "Country",
    type: "select",
    selectOptions: (
      Object.keys(countryCodeToDisplayNameMap) as Array<string>
    ).map((key) => ({
      value: key,
      label: `${
        countryCodeToFlagMap[key as keyof typeof countryCodeToFlagMap]
      } ${
        countryCodeToDisplayNameMap[
          key as keyof typeof countryCodeToDisplayNameMap
        ]
      }`,
    })),
    required: true,
    containerClasses: "pr-1.5 w-1/2",
  },
  {
    name: "city",
    placeholder: "City",
    type: "text",
    required: true,
    containerClasses: "pl-1.5 w-1/2",
  },

  {
    name: "startDate",
    placeholder: "Start Date",
    type: "month",
    required: true,
    containerClasses: "pr-1.5 w-1/2",
  },
  {
    name: "endDate",
    placeholder: "End Date",
    type: "month",
    containerClasses: "pl-1.5 w-1/2",
  },
  {
    name: "description",
    placeholder: "Description",
    type: "textarea",
    required: true,
    containerClasses: "w-full",
  },
];

export const linkFields: FormFieldsType[] = [
  {
    name: "name",
    placeholder: "Name",
    type: "text",
    required: true,
    containerClasses: "w-full",
  },
  {
    name: "url",
    // placeholder: "Url",
    placeholder: "https://example.com",
    type: "text",
    required: true,
    containerClasses: "pr-1.5 w-1/2",
  },
  {
    name: "alt",
    placeholder: "Text to display",
    type: "text",
    required: true,
    containerClasses: "pl-1.5 w-1/2",
  },
];

export const languageFields: FormFieldsType[] = [
  {
    name: "name",
    placeholder: "Language",
    type: "select",
    selectOptions: (
      Object.keys(countryCodeToDisplayLanguageMap) as Array<string>
    ).map((key) => ({
      value: key,
      label:
        countryCodeToDisplayLanguageMap[
          key as keyof typeof countryCodeToDisplayLanguageMap
        ],
    })),
    required: true,
    containerClasses: "w-full",
  },
];

export const themeFields: FormFieldsType[] = [
  {
    name: "bgColor",
    placeholder: "Background color",
    type: "color",
  },
  {
    name: "textColor",
    placeholder: "Text color",
    type: "color",
  },
  {
    name: "titleColor",
    placeholder: "Title color",
    type: "color",
  },
  {
    name: "linkColor",
    placeholder: "Link color",
    type: "color",
  },
  {
    name: "accentColor",
    placeholder: "Accent color",
    type: "color",
  },
  {
    name: "contrastColor",
    placeholder: "Contrast color",
    type: "color",
  },
  {
    name: "contrastTextColor",
    placeholder: "Contrast text color",
    type: "color",
  },
];
