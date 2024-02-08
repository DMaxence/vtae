"use server";
import prisma from "@/lib/prisma";

import type { Site } from "@prisma/client";
// import { revalidateSite } from '../revalidate'

import { withSiteAuth } from "@/lib/auth";
import { revalidateSite } from "../utils";

/**
 * Get PersonalInfos
 *
 * Fetches & returns either a single or all personal infos available depending on
 * whether a `userId` query parameter is provided. If not all personal infos are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const getPersonalInfos = async (siteId: string) => {
  const personalInfos = await prisma.personalInfos.findUnique({
    where: {
      siteId: siteId,
    },
  });

  return personalInfos;
};

/**
 * Create or update PersonalInfos
 *
 * Creates a new personalInfos from a set of provided query parameters.
 * These can include:
 *  - first name
 *  - last name
 *  - alias
 *  - about (bio)
 *
 * Once created, the personalInfos new `personalInfosId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const createOrUpdatePersonalInfos = withSiteAuth(
  async (data: object, site: Site) => {
    try {
      const response = await prisma.personalInfos.upsert({
        where: {
          siteId: site.id,
        },
        update: {
          ...data,
        },
        create: {
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
          error: `This personnal infos are already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);
