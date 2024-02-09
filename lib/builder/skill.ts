import prisma from "@/lib/prisma";

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
