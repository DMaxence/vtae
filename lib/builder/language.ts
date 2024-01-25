"use server";
import prisma from "@/lib/prisma";
import { withSiteAuth } from "../auth";
import { Language, Site } from "@prisma/client";
import { revalidateSite } from "../utils";

/**
 * Get Language
 *
 * Fetches & returns either a single or all sites available depending on
 * whether a `siteId` query parameter is provided. If not all sites are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const getLanguage = async (siteId: string, languageId?: string) => {
  if (languageId) {
    const language = await prisma.language.findFirst({
      where: {
        id: languageId,
      },
    });

    return language;
  }

  const languages = await prisma.language.findMany({
    where: {
      siteId: siteId,
    },
  });

  return languages;
};

/**
 * Create Language
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
export const createLanguage = withSiteAuth(
  async (data: Language, site: Site) => {
    try {
      const response = await prisma.language.create({
        data: {
          ...data,
          // site: {
          //   connect: {
          //     id: site.id,
          //   },
          // },
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
          error: `This language is already in use`,
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
 * Delete Language
 *
 * Deletes a site from the database using a provided `siteId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const deleteLanguage = withSiteAuth(
  async ({ languageId }: { languageId: string }, site: Site) => {
    try {
      const response = await prisma.language.delete({
        where: {
          id: languageId,
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
 * Update Language
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
export const updateLanguage = withSiteAuth(
  async ({ id, ...data }: Language, site: Site) => {
    try {
      const response = await prisma.language.update({
        where: {
          id: id,
        },
        data: {
          ...data,
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
          error: `This language is already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);
