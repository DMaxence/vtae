import { cn, getElapsedTime, getTextDate } from "@/lib/utils";
import { Media, Project, Skill } from "@prisma/client";

import Image from "next/image";
import Carousel from "react-multi-carousel";

type ProjectProps = {
  project: Project & {
    skills: Skill[];
    media: Media[];
  };
};

export default function Project({ project }: ProjectProps) {
  const hasImage = project.media.length > 0;
  return (
    <div className="flex flex-col gap-5 text-white sm:flex-row">
      {/* image */}
      {hasImage && (
        <div className="w-full sm:w-1/2">
          <Carousel
            responsive={{
              all: {
                breakpoint: { max: 4000, min: 0 },
                items: 1,
              },
            }}
            ssr
            // infinite
            className="rounded-lg"
          >
            {project.media.map((media, i) =>
              media.type === "IMAGE" ? (
                <Image
                  key={i}
                  src={project.media[0].url}
                  alt={project.title}
                  className="h-[400px] w-full object-cover"
                  width={550}
                  height={400}
                />
              ) : (
                <iframe
                  key={i}
                  src={media.url}
                  className="h-[400px] w-full object-cover"
                  height={400}
                />
              ),
            )}
          </Carousel>
        </div>
      )}
      {/* content */}
      <div
        className={cn("flex w-full flex-col gap-5", { "sm:w-1/2": hasImage })}
      >
        {/* title */}
        <div className="font-title text-2xl font-semibold">{project.title}</div>
        {/* date and Time on project */}
        <div className="flex flex-col gap-3.5">
          <div className="flex gap-2 text-xl font-semibold">
            <div>{getTextDate(project.startDate)}</div>
            <span>|</span>
            <div>
              {getElapsedTime(
                project.startDate,
                project?.endDate || new Date(),
              )}
            </div>
          </div>
          {/* skills list */}
          <div className="flex flex-wrap gap-3">
            {project.skills.map((skill, i) => (
              <div
                key={i}
                className="rounded-full bg-white px-3 py-1.5 text-[#1D072E]"
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>
        {/* description */}
        <div className="whitespace-pre-line">{project.description}</div>
      </div>
    </div>
  );
}
