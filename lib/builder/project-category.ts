import prisma from "@/lib/prisma";

/**
 * Get Category
 *
 * Fetches & returns either a single or all categorys available depending on
 * whether a `category` query parameter is provided. If not all categorys are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export const getProjectCategories = async (query?: string) => {
  if (query) {
    console.log("query", query);
    const categories = await prisma.projectCategory.findMany({
      where: {
        name: {
          contains: query,
        },
      },
    });

    return categories;
  }

  const categories = await prisma.projectCategory.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return categories;
};
