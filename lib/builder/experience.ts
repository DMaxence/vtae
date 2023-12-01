import prisma from "@/lib/prisma";

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
// export async function createExperience(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session
// ): Promise<void | NextApiResponse<{
//   experienceId: string
// }>> {
//   const {
//     type,
//     companyName,
//     companyUrl,
//     jobTitle,
//     startDate,
//     endDate,
//     location,
//     skills,
//     description,
//   } = req.body

//   if (!session.user.id)
//     return res.status(500).end('Server failed to get session user ID')

//   try {
//     const response = await prisma.experience.create({
//       data: {
//         type: type,
//         companyName: companyName,
//         companyUrl: companyUrl,
//         jobTitle: jobTitle,
//         startDate: new Date(startDate),
//         endDate: new Date(endDate),
//         location: location,
//         skills: {
//           connect: skills.map((skillId: string) => ({
//             id: skillId,
//           })),
//         },
//         description: description,
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
//       experienceId: response.id,
//     })
//   } catch (error) {
//     console.log(error, skills)
//     return res.status(500).end(error)
//   }
// }

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
// export async function deleteExperience(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session
// ): Promise<void | NextApiResponse> {
//   const { experienceId } = req.body

//   if (Array.isArray(experienceId))
//     return res
//       .status(400)
//       .end(`Bad request. experienceId parameter must be an array.`)

//   if (!session.user.id)
//     return res.status(500).end('Server failed to get session user ID')

//   try {
//     const response = await prisma.experience.delete({
//       where: {
//         id: experienceId,
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
// export async function updateExperience(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session
// ): Promise<void | NextApiResponse<Site>> {
//   const {
//     id,
//     type,
//     companyName,
//     companyUrl,
//     jobTitle,
//     startDate,
//     endDate,
//     location,
//     skills,
//     removeSkills,
//     description,
//   } = req.body

//   if (!session.user.id)
//     return res.status(500).end('Server failed to get session user ID')

//   try {
//     const response = await prisma.experience.update({
//       where: {
//         id: id,
//       },
//       data: {
//         type: type,
//         companyName: companyName,
//         companyUrl: companyUrl,
//         jobTitle: jobTitle,
//         startDate: new Date(startDate),
//         endDate: new Date(endDate),
//         location: location,
//         // replace connect with set to remove all skills and replace with new ones
//         skills: {
//           connect: skills.map((skillId: string) => ({
//             id: skillId,
//           })),
//           disconnect: removeSkills.map((skillId: string) => ({
//             id: skillId,
//           })),
//         },
//         description: description,
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
