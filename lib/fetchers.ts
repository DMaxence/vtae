import prisma from "@/lib/prisma";
import { replaceTweets } from "@/lib/remark-plugins";
import { serialize } from "next-mdx-remote/serialize";
import { unstable_cache } from "next/cache";

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      return prisma.site.findUnique({
        where: subdomain ? { subdomain } : { customDomain: domain },
        include: {
          user: true,
          personalInfos: true,
          experiences: {
            include: {
              skills: true,
            },
            orderBy: {
              startDate: "desc",
            },
          },
          educations: {
            orderBy: {
              startDate: "desc",
            },
          },
          projects: {
            include: {
              skills: true,
              category: true,
              medias: true,
            },
            orderBy: {
              startDate: "desc",
            },
          },
          links: true,
          languages: true,
          theme: true,
        },
      });
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )();
}
