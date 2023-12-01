"use client";
import React from "react";

import type { Education as EducationType, Theme } from "@prisma/client";

import { countryCodeToDisplayNameMap } from "@/constants/countryCodeToDisplayNameMap";
import { CalendarDays, MapPin, PenSquare } from "lucide-react";
// import EducationModal from "../builder/Modals/EducationModal";
import { getTextDate } from "@/lib/utils";
import { useModal } from "../modal/provider";
import EducationModal from "../builder/Modals/education-modal";

const Education = ({
  education,
  readOnly,
  theme,
  siteId,
}: {
  education: EducationType;
  readOnly?: boolean;
  theme?: Theme;
  siteId: string;
}) => {
  const modal = useModal();

  return (
    <div className="flex flex-col gap-3.5 py-3.5">
      <div className="flex items-center justify-between">
        <div className="">
          <div className="text-lg font-semibold">{education.place}</div>
          <div className="text-xl font-semibold">
            {education.degree} &bull; {education.degreeField}
          </div>
          <div
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
            style={{ color: theme?.accentColor }}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {getTextDate(education.startDate)} -{" "}
            {education.endDate ? getTextDate(education.endDate) : "Ongoing"}
          </div>
          <div
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
            style={{ color: theme?.accentColor }}
          >
            <MapPin className="h-3.5 w-3.5" />
            {countryCodeToDisplayNameMap[education.country]}, {education.city}
          </div>
        </div>
        {!readOnly && (
          <div>
            <button
              type="button"
              onClick={() =>
                modal?.show(
                  <EducationModal siteId={siteId} educationId={education.id} />,
                )
              }
            >
              <PenSquare className="h-5 w-5 text-gray-500 dark:text-gray-100" />
            </button>
          </div>
        )}
      </div>
      <div className="whitespace-pre-line">{education.description}</div>
    </div>
  );
};
export default Education;
