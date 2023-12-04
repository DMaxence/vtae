"use server";
import prisma from "@/lib/prisma";

import type { Education, Site } from "@prisma/client";
import { withSiteAuth } from "../auth";
import { revalidateSite } from "../utils";

/**
 * Get Education
 *
 * Fetches & returns either a single or all sites available depending on
 * whether a `siteId` query parameter is provided. If not all sites are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const getEducation = async (siteId: string, educationId?: string) => {
  if (educationId) {
    const education = await prisma.education.findFirst({
      where: {
        id: educationId,
      },
    });

    return education;
  }

  const educations = await prisma.education.findMany({
    where: {
      siteId: siteId,
    },
    orderBy: {
      startDate: "desc",
    },
  });

  return educations;
};
// export async function getEducation(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session,
// ): Promise<void | NextApiResponse<Array<Education> | (Education | null)>> {
//   const { type, educationId } = req.query;

//   if (Array.isArray(type) || Array.isArray(educationId))
//     return res.status(400).end("Bad request. parameter cannot be an array.");

//   if (!session.user.id)
//     return res.status(500).end("Server failed to get session user ID");

//   try {
//     if (educationId) {
//       const settings = await prisma.education.findFirst({
//         where: {
//           id: educationId,
//           user: {
//             id: session.user.id,
//           },
//         },
//       });

//       return res.status(200).json(settings);
//     }

//     const educations = await prisma.education.findMany({
//       where: {
//         ...(type && { type: type }),
//         user: {
//           id: session.user.id,
//         },
//       },
//       orderBy: {
//         startDate: "desc",
//       },
//     });

//     return res.status(200).json(educations);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).end(error);
//   }
// }

/**
 * Create Education
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
export const createEducation = withSiteAuth(
  async ({ startDate, endDate, ...data }: Education, site: Site) => {
    try {
      const response = await prisma.education.create({
        data: {
          ...data,
          startDate: new Date(startDate),
          ...(endDate ? { endDate: new Date(endDate) } : {}),
          site: {
            connectOrCreate: {
              where: {
                id: site.id,
              },
              create: {
                id: site.id,
              },
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
          error: `This education is already in use`,
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
 * Delete Education
 *
 * Deletes a site from the database using a provided `siteId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const deleteEducation = withSiteAuth(
  async ({ educationId }: { educationId: string }, site: Site) => {
    try {
      const response = await prisma.education.delete({
        where: {
          id: educationId,
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
 * Update Education
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
export const updateEducation = withSiteAuth(
  async ({ id, startDate, endDate, ...data }: Education) => {
    try {
      const response = await prisma.education.update({
        where: {
          id: id,
        },
        data: {
          ...data,
          startDate: new Date(startDate),
          ...(endDate ? { endDate: new Date(endDate) } : {}),
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
