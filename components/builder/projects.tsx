import ProjectSkeleton from "../skeletons/ExperienceSkeleton";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { WithSiteId } from "@/lib/types";
import { redirect } from "next/navigation";
import Project from "../displayer/project";

interface ProjectsProps extends WithSiteId {}

export default async function Projects({ siteId }: ProjectsProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: {
      siteId,
    },
    orderBy: {
      startDate: "desc",
    },
    include: {
      skills: true,
    },
  });

  return (
    <div className="flex flex-col divide-y divide-gray-200">
      {projects ? (
        projects.length > 0 ? (
          projects.map((project) => (
            <Project key={project.id} project={project} siteId={siteId} />
          ))
        ) : (
          <p className="whitespace-pre-line text-sm text-gray-400">
            No projects yet. Add one !
          </p>
        )
      ) : (
        <ProjectSkeleton />
      )}
    </div>
  );
}
