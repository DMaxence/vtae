"use server";

import prisma from "@/lib/prisma";
import { Site, Skill } from "@prisma/client";
import { withSiteAuth } from "../auth";

/**
 * Get Skill
 *
 * Fetches & returns either a single or all skills available depending on
 * whether a `skill` query parameter is provided. If not all skills are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const getSkill = async (query?: string) => {
  if (query) {
    console.log("query", query);
    const skills = await prisma.skill.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      include: {
        experiences: { select: { id: true } },
        projects: { select: { id: true } },
      },
    });

    return skills;
  }

  const skills = await prisma.skill.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return skills;
};

export const getSkillsFromSite = async (siteId: string) => {
  const skills = await prisma.skill.findMany({
    where: {
      sites: {
        some: {
          id: siteId,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return skills;
};

export const getSkillsFromProjects = async (siteId: string) => {
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
      ],
    },
    orderBy: {
      name: "asc",
    },
  });

  return skills;
};

export const updateSiteSkills = withSiteAuth(
  async (
    {
      skills,
      removeSkills,
    }: {
      skills: Skill[];
      removeSkills: string[];
    },
    site: Site,
  ) => {
    const response = await prisma.site.update({
      where: {
        id: site.id,
      },
      data: {
        skills: {
          connectOrCreate: skills.map((skill) => ({
            where: { id: skill.id },
            create: { name: skill.name },
          })),
          disconnect: removeSkills.map((skillId: string) => ({
            id: skillId,
          })),
        },
      },
    });

    return response;
  },
);
