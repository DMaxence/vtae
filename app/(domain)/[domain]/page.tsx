import { getSession } from "@/lib/auth";
import { getSiteData } from "@/lib/fetchers";
import prisma from "@/lib/prisma";
import { GameDev, Light } from "@/themes";
import { notFound, redirect } from "next/navigation";

const themes = {
  RESUME: {
    light: Light,
  },
  PORTFOLIO: {
    gamedev: GameDev,
  },
};

export async function generateStaticParams() {
  const allSites = await prisma.site.findMany({
    select: {
      subdomain: true,
      customDomain: true,
    },
    // feel free to remove this filter if you want to generate paths for all sites
    where: {
      subdomain: "demo",
    },
  });

  const allPaths = allSites
    .flatMap(({ subdomain, customDomain }) => [
      subdomain && {
        domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      },
      customDomain && {
        domain: customDomain,
      },
    ])
    .filter(Boolean);

  return allPaths;
}

export const dynamic = "force-dynamic";

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);
  const session = await getSession();
  // const [data, posts] = await Promise.all([
  //   getSiteData(domain),
  //   getPostsForSite(domain),
  // ]);

  if (!data) {
    notFound();
  }
  console.log("im in page domain", session, data.userId);

  if (data.theme) {
    const themeType = themes[data.type as keyof typeof themes];
    if (!themeType) {
      throw new Error(`Unknown theme type: ${data.type}`);
    }
    const theme = themeType[data.theme.slug as keyof typeof themeType];
    if (!theme) {
      throw new Error(`Unknown theme: ${data.theme.slug}`);
    }
    const themeFunction = theme as (data: any) => JSX.Element;
    return themeFunction({ site: data });
  }
}
