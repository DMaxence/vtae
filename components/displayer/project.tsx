"use client";
import React from "react";

import type {
  Media,
  Project as ProjectType,
  Skill,
  Theme,
} from "@prisma/client";

import { EmploymentType, WithOptionalSiteId } from "@/lib/types";
import { cn, getElapsedTime, getTextDate } from "@/lib/utils";
import { CalendarDays, PenSquare } from "lucide-react";
import "react-multi-carousel/lib/styles.css";
import ProjectModal from "../builder/Modals/project-modal";

const Skill = ({ skill, theme }: { skill: Skill; theme?: Theme }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-normal",
        skill.primary
          ? "bg-gray-100 text-gray-800"
          : "border border-gray-200 bg-white text-gray-500",
      )}
      // style={{
      //   color: theme?.contrastTextColor,
      //   backgroundColor: theme?.contrastColor,
      // }}
    >
      {skill.name}
    </span>
  );
};

interface ProjectProps extends WithOptionalSiteId {
  project: ProjectType & {
    skills: Skill[];
    medias: Media[];
  };
  theme?: Theme;
  readOnly?: boolean;
}

const Project = ({ project, readOnly, theme, siteId }: ProjectProps) => {
  const [showModal, setShowModal] = React.useState<boolean>(false);

  return (
    <div className="flex break-inside-avoid-page flex-col gap-3.5 py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between">
        <div className="">
          <div
            className="text-sm uppercase text-gray-500 dark:text-gray-400"
            // style={{ color: theme?.accentColor }}
          >
            {EmploymentType[project.type as keyof typeof EmploymentType]}
          </div>
          <div className="text-xl font-semibold">{project.title}</div>
          <div
            className="flex items-center gap-1.5 text-sm font-light text-gray-500 dark:text-gray-400"
            // style={{ color: theme?.accentColor }}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {getTextDate(project.startDate)} -{" "}
            {project.endDate ? getTextDate(project.endDate) : "Ongoing"} ·{" "}
            {getElapsedTime(project.startDate, project.endDate ?? new Date())}
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
      {project.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <Skill key={skill.id} skill={skill} theme={theme} />
          ))}
        </div>
      )}
      <div className="whitespace-pre-line">{project.description}</div>
      <div className="flex w-full gap-3.5 overflow-x-scroll">
        {project.medias?.map((media) =>
          media.type === "IMAGE" ? (
            <img
              key={media.id}
              src={media.url}
              className="h-32 w-44 rounded-lg object-cover"
              alt=""
              draggable
            />
          ) : (
            <iframe
              key={media.id}
              src={media.url}
              className="h-32 w-44 rounded-lg object-cover"
            />
          ),
        )}
      </div>
      {!readOnly && siteId && (
        <ProjectModal
          siteId={siteId}
          projectId={project.id}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
    </div>
  );
};
export default Project;
