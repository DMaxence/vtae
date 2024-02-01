"use client";
import { MaxWidthWrapper } from "@/components/home/max-width-wrapper";
import { cn } from "@/lib/utils";
import { Tab } from "@headlessui/react";
import {
  Media,
  ProjectCategory,
  Project as ProjectType,
  Site,
  Skill,
} from "@prisma/client";
import Project from "./project";

type Projects = {
  site: Site & {
    projects: (ProjectType & {
      skills: Skill[];
      category: ProjectCategory;
      media: Media[];
    })[];
  };
};

export default function Projects({ site }: Projects) {
  const categories = site.projects.reduce((acc, project) => {
    if (acc.includes(project.category)) {
      return acc;
    }
    return [...acc, project.category];
  }, [] as ProjectCategory[]);

  return (
    <MaxWidthWrapper id="projects" className="flex flex-col gap-3.5 py-10">
      <Tab.Group>
        <div className="mb-5 flex flex-col gap-3.5">
          <div className="text-center text-4xl font-bold uppercase text-white">
            Projects
          </div>
          <hr className="w-[100px] self-center border-[#F15050]" />
        </div>

        <div className="flex items-center justify-center">
          <Tab.List className="flex space-x-1 rounded-full bg-white/40 shadow-lg md:min-w-[400px]">
            {categories.map((category) => (
              <Tab
                key={category.slug}
                className={({ selected }) =>
                  cn(
                    "w-full rounded-full px-5 py-2.5 text-sm font-medium leading-5 sm:px-10",
                    "focus:outline-none focus:ring-2",
                    selected
                      ? "bg-white text-[#1D072E] shadow"
                      : "text-[rgba(29,7,46,0.4)] hover:text-white",
                  )
                }
              >
                {category.name}
              </Tab>
            ))}
          </Tab.List>
        </div>

        <Tab.Panels className="mt-2">
          {categories.map((category) =>
            site.projects
              .filter((project) => project.category.slug === category.slug)
              .map((project, idx) => (
                <Tab.Panel key={idx}>
                  <Project project={project} />
                </Tab.Panel>
              )),
          )}
        </Tab.Panels>
      </Tab.Group>
    </MaxWidthWrapper>
  );
}
