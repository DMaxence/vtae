"use server";
import prisma from "@/lib/prisma";

import { Experience, Site } from "@prisma/client";
import { withSiteAuth } from "../auth";
import { revalidateSite } from "../utils";

/**
 * Get Experience
 *
 * Fetches & returns either a single or all sites available depending on
 * whether a `siteId` query parameter is provided. If not all sites are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const getExperience = async (siteId: string, experienceId?: string) => {
  if (experienceId) {
    const experience = await prisma.experience.findFirst({
      where: {
        id: experienceId,
      },
      include: {
        skills: true,
      },
    });

    return experience;
  }

  const experiences = await prisma.experience.findMany({
    where: {
      siteId: siteId,
    },
    orderBy: {
      startDate: "desc",
    },
    include: {
      skills: true,
    },
  });

  return experiences;
};

/**
 * Create Experience
 *
 * Creates a new site from a set of provided query parameters.
 * These include:
 *  - name
 *  - description
 *  - subdomain
 *  - userId
 *
 * Once created, the sites new `siteId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const createExperience = withSiteAuth(
  async (
    {
      type,
      companyName,
      companyUrl,
      jobTitle,
      startDate,
      endDate,
      location,
      skills,
      description,
    }: Experience & { skills: string[] },
    site: Site,
  ) => {
    console.log("createExperience", {
      type,
      companyName,
      companyUrl,
      jobTitle,
      startDate,
      endDate,
      location,
      skills,
      description,
      site,
    });
    try {
      const response = await prisma.experience.create({
        data: {
          type,
          companyName,
          companyUrl,
          jobTitle,
          description,
          location,
          startDate: new Date(startDate),
          ...(endDate ? { endDate: new Date(endDate) } : {}),
          skills: {
            connect: skills.map((skillId: string) => ({
              id: skillId,
            })),
          },
          siteId: site.id,
        },
        include: {
          site: {
            select: { subdomain: true, customDomain: true },
          },
        },
      });

      await revalidateSite(response.site as Site);
      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This experience is already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

/**
 * Delete Experience
 *
 * Deletes a site from the database using a provided `siteId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const deleteExperience = withSiteAuth(
  async ({ experienceId }: { experienceId: string }, site: Site) => {
    try {
      const response = await prisma.experience.delete({
        where: {
          id: experienceId,
        },
        include: {
          site: {
            select: { subdomain: true, customDomain: true },
          },
        },
      });

      await revalidateSite(response.site as Site);
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);

/**
 * Update Experience
 *
 * Updates a site & all of its data using a collection of provided
 * query parameters. These include the following:
 *  - id
 *  - currentSubdomain
 *  - name
 *  - description
 *  - image
 *  - imageBlurhash
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const updateExperience = withSiteAuth(
  async (
    {
      id,
      type,
      companyName,
      companyUrl,
      jobTitle,
      startDate,
      endDate,
      location,
      skills,
      removeSkills,
      description,
    }: Experience & {
      skills: string[];
      removeSkills: string[];
    },
    site: Site,
  ) => {
    try {
      const response = await prisma.experience.update({
        where: {
          id: id,
        },
        data: {
          type,
          companyName,
          companyUrl,
          jobTitle,
          description,
          location,
          startDate: new Date(startDate),
          ...(endDate ? { endDate: new Date(endDate) } : {}),
          // replace connect with set to remove all skills and replace with new ones
          skills: {
            connect: skills.map((skillId: string) => ({
              id: skillId,
            })),
            disconnect: removeSkills.map((skillId: string) => ({
              id: skillId,
            })),
          },
        },
        include: {
          site: {
            select: { subdomain: true, customDomain: true },
          },
        },
      });

      await revalidateSite(response.site as Site);
      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This experience is already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);
