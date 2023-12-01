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
      experiences: {
        some: {
          siteId,
          // user: {
          //   id: session.user.id as string,
          // },
        },
      },
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
