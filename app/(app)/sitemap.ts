import { headers } from "next/headers";

export default async function Sitemap() {
  const headersList = headers();
  const domain =
    headersList
      .get("host")
      ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) ??
    "vtae.xyz";

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    {
      url: `https://${domain}/terms`,
      lastModified: new Date("2024/01/31"),
    },
    {
      url: `https://${domain}/privacy`,
      lastModified: new Date("2024/01/31"),
    },
  ];
}
