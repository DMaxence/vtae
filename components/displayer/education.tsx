"use client";
import React from "react";

import type { Education as EducationType, Theme } from "@prisma/client";

import { countryCodeToDisplayNameMap } from "@/constants/countryCodeToDisplayNameMap";
import { CalendarDays, MapPin, PenSquare } from "lucide-react";
// import EducationModal from "../builder/Modals/EducationModal";
import { getTextDate } from "@/lib/utils";

import EducationModal from "../builder/Modals/education-modal";
import { WithOptionalSiteId } from "@/lib/types";

interface EducationProps extends WithOptionalSiteId {
  education: EducationType;
  readOnly?: boolean;
  theme?: Theme;
}

const Education = ({ education, readOnly, theme, siteId }: EducationProps) => {
  const [showModal, setShowModal] = React.useState<boolean>(false);

  return (
    <div className="flex flex-col gap-3.5 py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between">
        <div className="">
          <div className="text-lg font-semibold">{education.place}</div>
          <div className="text-xl font-semibold">
            {education.degree} &bull; {education.degreeField}
          </div>
          <div
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
            // style={{ color: theme?.accentColor }}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {getTextDate(education.startDate)} -{" "}
            {education.endDate ? getTextDate(education.endDate) : "Ongoing"}
          </div>
          <div
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
            // style={{ color: theme?.accentColor }}
          >
            <MapPin className="h-3.5 w-3.5" />
            {
              countryCodeToDisplayNameMap[
                education.country as keyof typeof countryCodeToDisplayNameMap
              ]
            }
            , {education.city}
          </div>
        </div>
        {!readOnly && (
          <div>
            <button type="button" onClick={() => setShowModal(true)}>
              <PenSquare className="h-5 w-5 text-gray-500 dark:text-gray-100" />
            </button>
          </div>
        )}
      </div>
      <div className="whitespace-pre-line">{education.description}</div>
      {!readOnly && siteId && (
        <EducationModal
          siteId={siteId}
          educationId={education.id}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
    </div>
  );
};
export default Education;
