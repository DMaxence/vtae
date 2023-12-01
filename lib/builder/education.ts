import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Site, Education } from ".prisma/client";
import type { Session } from "next-auth";

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
// export async function createEducation(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session
// ): Promise<void | NextApiResponse<{
//   educationId: string
// }>> {
//   const { startDate, endDate } = req.body

//   if (!session.user.id)
//     return res.status(500).end('Server failed to get session user ID')

//   try {
//     const response = await prisma.education.create({
//       data: {
//         ...req.body,
//         startDate: new Date(startDate),
//         endDate: new Date(endDate),
//         user: {
//           connect: {
//             id: session.user.id,
//           },
//         },
//         site: {
//           connectOrCreate: {
//             where: {
//               userId: session.user.id,
//             },
//             create: {
//               userId: session.user.id,
//             },
//           },
//         },
//       },
//       include: {
//         site: {
//           select: { subdomain: true, customDomain: true },
//         },
//       },
//     })

//     await revalidateSite(response.site)

//     return res.status(201).json({
//       educationId: response.id,
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).end(error)
//   }
// }

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
// export async function deleteEducation(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session
// ): Promise<void | NextApiResponse> {
//   const { educationId } = req.body

//   if (Array.isArray(educationId))
//     return res
//       .status(400)
//       .end(`Bad request. educationId parameter must be an array.`)

//   if (!session.user.id)
//     return res.status(500).end('Server failed to get session user ID')

//   try {
//     const response = await prisma.education.delete({
//       where: {
//         id: educationId,
//       },
//       include: {
//         site: {
//           select: { subdomain: true, customDomain: true },
//         },
//       },
//     })

//     await revalidateSite(response.site)

//     return res.status(200).end()
//   } catch (error) {
//     console.error(error)
//     return res.status(500).end(error)
//   }
// }

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
// export async function updateEducation(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session
// ): Promise<void | NextApiResponse<Site>> {
//   const { id, startDate, endDate } = req.body

//   if (!session.user.id)
//     return res.status(500).end('Server failed to get session user ID')

//   try {
//     const response = await prisma.education.update({
//       where: {
//         id: id,
//       },
//       data: {
//         ...req.body,
//         startDate: new Date(startDate),
//         endDate: new Date(endDate),
//         user: {
//           connect: {
//             id: session.user.id,
//           },
//         },
//       },
//       include: {
//         site: {
//           select: { subdomain: true, customDomain: true },
//         },
//       },
//     })

//     await revalidateSite(response.site)

//     return res.status(200).json(response)
//   } catch (error) {
//     console.error(error)
//     return res.status(500).end(error)
//   }
// }
