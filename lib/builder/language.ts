import prisma from "@/lib/prisma";

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
// export async function createLanguage(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session
// ): Promise<void | NextApiResponse<{
//   languageId: string
// }>> {
//   if (!session.user.id)
//     return res.status(500).end('Server failed to get session user ID')

//   try {
//     const response = await prisma.language.create({
//       data: {
//         ...req.body,
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
//       languageId: response.id,
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).end(error)
//   }
// }

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
// export async function deleteLanguage(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session
// ): Promise<void | NextApiResponse> {
//   const { languageId } = req.body

//   if (Array.isArray(languageId))
//     return res
//       .status(400)
//       .end(`Bad request. languageId parameter must be an array.`)

//   if (!session.user.id)
//     return res.status(500).end('Server failed to get session user ID')

//   try {
//     const response = await prisma.language.delete({
//       where: {
//         id: languageId,
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
// export async function updateLanguage(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session
// ): Promise<void | NextApiResponse<Site>> {
//   const { id, startDate, endDate } = req.body

//   if (!session.user.id)
//     return res.status(500).end('Server failed to get session user ID')

//   try {
//     const response = await prisma.language.update({
//       where: {
//         id: id,
//       },
//       data: {
//         ...req.body,
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
