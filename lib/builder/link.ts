"use server";
import prisma from "@/lib/prisma";
import { withSiteAuth } from "../auth";
import { Link, Site } from "@prisma/client";
import { revalidateSite } from "../utils";

/**
 * Get Link
 *
 * Fetches & returns either a single or all sites available depending on
 * whether a `siteId` query parameter is provided. If not all sites are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const getLink = async (siteId: string, linkId?: string) => {
  if (linkId) {
    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
      },
    });

    return link;
  }

  const links = await prisma.link.findMany({
    where: {
      siteId: siteId,
    },
  });

  return links;
};

/**
 * Create Link
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
export const createLink = withSiteAuth(async (data: Link, site: Site) => {
  try {
    const response = await prisma.link.create({
      data: {
        ...data,
        site: {
          connect: {
            id: site.id,
          },
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
        error: `This link is already in use`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
});

/**
 * Delete Link
 *
 * Deletes a site from the database using a provided `siteId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const deleteLink = withSiteAuth(
  async ({ linkId }: { linkId: string }, site: Site) => {
    try {
      const response = await prisma.link.delete({
        where: {
          id: linkId,
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
 * Update Link
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
export const updateLink = withSiteAuth(
  async ({ id, ...data }: Link, site: Site) => {
    try {
      const response = await prisma.link.update({
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
          error: `This link is already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);
