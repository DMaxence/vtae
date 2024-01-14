"use client";
import React from "react";

import type {
  Experience as ExperienceType,
  Skill,
  Theme,
} from "@prisma/client";

import { cn, getClickableLink, getElapsedTime, getTextDate } from "@/lib/utils";
import { CalendarDays, Link, MapPin, PenSquare } from "lucide-react";
import { EmploymentType, WithSiteId } from "@/lib/types";
import ExperienceModal from "../builder/Modals/experience-modal";

const Skill = ({ skill, theme }: { skill: Skill; theme?: Theme }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-normal",
        skill.primary
          ? "bg-gray-100 text-gray-800"
          : "border border-gray-200 bg-white text-gray-500",
      )}
      style={{
        color: theme?.contrastTextColor,
        backgroundColor: theme?.contrastColor,
      }}
    >
      {skill.name}
    </span>
  );
};

interface ExperienceProps extends WithSiteId {
  experience: ExperienceType & {
    skills: Skill[];
  };
  theme?: Theme;
  readOnly?: boolean;
}

const Experience = ({
  experience,
  readOnly,
  theme,
  siteId,
}: ExperienceProps) => {
  const [showModal, setShowModal] = React.useState<boolean>(false);

  return (
    <div className="flex break-inside-avoid-page flex-col gap-3.5 py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between">
        <div className="">
          <div
            className="text-sm uppercase text-gray-500 dark:text-gray-400"
            style={{ color: theme?.accentColor }}
          >
            {EmploymentType[experience.type]}
          </div>
          {experience.companyUrl ? (
            <div className="flex gap-1 text-xl font-semibold">
              <a
                href={getClickableLink(experience.companyUrl)}
                rel="noopener noreferrer"
                target="_blank"
                className="hover:underline"
              >
                <div className="flex cursor-pointer items-center gap-1.5 text-xl font-semibold">
                  {experience.companyName}
                  <Link className="h-5 w-5" />
                </div>
              </a>
              &bull; {experience.jobTitle}
            </div>
          ) : (
            <div className="text-xl font-semibold">
              {experience.companyName} &bull; {experience.jobTitle}
            </div>
          )}
          <div
            className="flex items-center gap-1.5 text-sm font-light text-gray-500 dark:text-gray-400"
            style={{ color: theme?.accentColor }}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {getTextDate(experience.startDate)} -{" "}
            {experience.endDate ? getTextDate(experience.endDate) : "Ongoing"} ·{" "}
            {getElapsedTime(
              experience.startDate,
              experience.endDate ?? new Date(),
            )}
          </div>
          {experience.location && (
            <div
              className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-300"
              style={{ color: theme?.accentColor }}
            >
              <MapPin className="h-3.5 w-3.5" />
              {experience.location}
            </div>
          )}
        </div>
        {!readOnly && (
          <div>
            <button type="button" onClick={() => setShowModal(true)}>
              <PenSquare className="h-5 w-5 text-gray-500 dark:text-gray-100" />
            </button>
          </div>
        )}
      </div>
      {experience.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {experience.skills.map((skill) => (
            <Skill key={skill.id} skill={skill} theme={theme} />
          ))}
        </div>
      )}
      <div className="whitespace-pre-line">{experience.description}</div>
      {!readOnly && siteId && (
        <ExperienceModal
          siteId={siteId}
          experienceId={experience.id}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
    </div>
  );
};
export default Experience;
