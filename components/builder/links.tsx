import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import Link from "../displayer/link";
import { WithSiteId } from "@/lib/types";

interface LinksProps extends WithSiteId {}

export default async function Links({ siteId }: LinksProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const links = await prisma.link.findMany({
    where: {
      siteId,
    },
  });

  return (
    <div className="flex flex-col divide-y divide-gray-200">
      {links &&
        (links.length > 0 ? (
          links.map((link) => (
            <Link key={link.id} siteId={siteId} link={link} />
          ))
        ) : (
          <>
            <div className="text-center">
              <p className="font-cal text-xl text-gray-600">
                No link yet. Add one !
              </p>
            </div>
          </>
        ))}
    </div>
  );
}
