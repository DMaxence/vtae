import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import PersonalInfosDisplay from "../displayer/personal-infos";

import { WithSiteId } from "@/lib/types";
import { getExperienceYears } from "@/lib/utils";
import type {
  Experience,
  PersonalInfos as PersonalInfosType,
} from "@prisma/client";

interface PersonalInfosProps extends WithSiteId {}

export default async function PersonalInfos({ siteId }: PersonalInfosProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const personalInfos = await prisma.personalInfos.findUnique({
    where: {
      siteId,
    },
  });
  const experiences = await prisma.experience.findMany({
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
  const experienceYears = getExperienceYears(experiences as Experience[]);
  return (
    <PersonalInfosDisplay
      personalInfos={personalInfos as PersonalInfosType}
      image={session?.user?.image}
      experience={experienceYears}
    />
  );
}
