import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { PersonalInfos } from "@prisma/client";
import type { Session } from "next-auth";
// import { revalidateSite } from '../revalidate'
import { revalidateTag } from "next/cache";

import { getSession } from "@/lib/auth";

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
// export async function createOrUpdatePersonalInfos(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: Session,
// ): Promise<void | NextApiResponse<{
//   personalInfosId: string;
// }>> {
//   if (!session.user.id)
//     return res.status(500).end("Server failed to get session user ID");

//   try {
//     const response = await prisma.personalInfos.upsert({
//       where: {
//         userId: session.user.id,
//       },
//       update: {
//         ...req.body,
//       },
//       create: {
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
//         ...req.body,
//       },
//       include: {
//         site: {
//           select: { subdomain: true, customDomain: true },
//         },
//       },
//     });

//     // await revalidateSite(response.site)
//     // await revalidateTag(
//     //   `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
//     // );

//     return res.status(201).json({
//       personalInfosId: response.id,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).end(error);
//   }
// };
