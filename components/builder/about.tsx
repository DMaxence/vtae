import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import { aboutFields } from "@/constants/fields";
import { WithSiteId } from "@/lib/types";

interface AboutSectionProps extends WithSiteId {}

export default async function AboutSection({ siteId }: AboutSectionProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const personalInfos = await prisma.personalInfos.findUnique({
    where: {
      siteId,
    },
  });
  return (
    <div className="flex flex-col">
      {personalInfos?.about ? (
        <p className="whitespace-pre-line text-justify">
          {personalInfos.about}
        </p>
      ) : (
        <p className="whitespace-pre-line text-sm text-gray-400">
          {aboutFields[0].placeholder}
        </p>
      )}
    </div>
  );
}
