import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import PersonalInfos from "../displayer/personal-infos";

import { getExperienceYears } from "@/lib/utils";
import type {
  Experience,
  PersonalInfos as PersonalInfosType,
} from "@prisma/client";
import { WithSiteId } from "@/lib/types";

interface PersonalInfosSectionProps extends WithSiteId {}

export default async function PersonalInfosSection({
  siteId,
}: PersonalInfosSectionProps) {
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
    <PersonalInfos
      personalInfos={personalInfos as PersonalInfosType}
      image={session?.user?.image}
      experience={experienceYears}
    />
  );
}
