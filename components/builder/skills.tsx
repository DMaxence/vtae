import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import Skill from "../displayer/skill";
import { WithSiteId } from "@/lib/types";

interface SkillsProps extends WithSiteId {}

export default async function Skills({ siteId }: SkillsProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const skills = await prisma.skill.findMany({
    where: {
      OR: [
        {
          experiences: {
            some: {
              siteId,
            },
          },
        },
        {
          projects: {
            some: {
              siteId,
            },
          },
        },
        {
          sites: {
            some: {
              id: siteId,
            },
          },
        },
      ],
    },
    orderBy: {
      name: "asc",
    },
  });
  return (
    <div className="flex flex-wrap gap-2">
      {skills?.map((skill) => <Skill key={skill.id} skill={skill} />)}
    </div>
  );
}
