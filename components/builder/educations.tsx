import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import Education from "../displayer/education";
import { WithSiteId } from "@/lib/types";

interface EducationsProps extends WithSiteId {}

export default async function Educations({ siteId }: EducationsProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const educations = await prisma.education.findMany({
    where: {
      siteId,
    },
    orderBy: {
      startDate: "desc",
    },
  });
  // const { data: session } = useSession();

  // const sessionId = session?.user?.id;

  // const { data: educations } = useSWR<Array<EducationType>>(
  //   sessionId && `/api/education`,
  //   fetcher,
  // );

  return (
    <div className="flex flex-col divide-y divide-gray-200">
      {educations &&
        (educations.length > 0 ? (
          educations.map((education) => (
            <Education
              key={education.id}
              education={education}
              siteId={siteId}
            />
          ))
        ) : (
          <p className="whitespace-pre-line text-sm text-gray-400">
            No education yet. Add one !
          </p>
        ))}
    </div>
  );
}
