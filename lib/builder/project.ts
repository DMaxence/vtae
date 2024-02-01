"use server";
import prisma from "@/lib/prisma";

import { Project, Site } from "@prisma/client";
import { withSiteAuth } from "../auth";
import { revalidateSite } from "../utils";

/**
 * Get Project
 *
 * Fetches & returns either a single or all sites available depending on
 * whether a `siteId` query parameter is provided. If not all sites are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const getProject = async (siteId: string, projectId?: string) => {
  if (projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
      },
      include: {
        skills: true,
      },
    });

    return project;
  }

  const projects = await prisma.project.findMany({
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

  return projects;
};

/**
 * Create Project
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
export const createProject = withSiteAuth(
  async (
    {
      type,
      url,
      title,
      startDate,
      endDate,
      skills,
      description,
    }: Project & { skills: string[] },
    site: Site,
  ) => {
    console.log("createProject", {
      type,
      url,
      title,
      startDate,
      endDate,
      skills,
      description,
      site,
    });
    try {
      const response = await prisma.project.create({
        data: {
          type,
          url,
          title,
          description,
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
          error: `This project is already in use`,
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
 * Delete Project
 *
 * Deletes a site from the database using a provided `siteId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const deleteProject = withSiteAuth(
  async ({ projectId }: { projectId: string }, site: Site) => {
    try {
      const response = await prisma.project.delete({
        where: {
          id: projectId,
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
 * Update Project
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
export const updateProject = withSiteAuth(
  async (
    {
      id,
      type,
      url,
      title,
      startDate,
      endDate,
      skills,
      removeSkills,
      description,
    }: Project & {
      skills: string[];
      removeSkills: string[];
    },
    site: Site,
  ) => {
    try {
      const response = await prisma.project.update({
        where: {
          id: id,
        },
        data: {
          type,
          url,
          title,
          description,
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
          error: `This project is already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);
