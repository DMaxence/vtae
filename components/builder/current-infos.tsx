import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import CurrentInfosDisplay from "../displayer/current-infos";
import { PersonalInfos } from "@prisma/client";
import { WithSiteId } from "@/lib/types";

interface CurrentInfosProps extends WithSiteId {}

export default async function CurrentInfos({ siteId }: CurrentInfosProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const personalInfos = await prisma.personalInfos.findUnique({
    where: {
      siteId,
    },
  });
  return personalInfos?.location || personalInfos?.currentWork ? (
    <CurrentInfosDisplay personalInfos={personalInfos as PersonalInfos} />
  ) : (
    <p className="whitespace-pre-line text-sm text-gray-400">
      Tell people where you live and your job title
    </p>
  );
}
