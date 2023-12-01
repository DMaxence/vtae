import ExperienceSkeleton from "../skeletons/ExperienceSkeleton";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Experience from "../displayer/experience";
import { WithSiteId } from "@/lib/types";

interface ExperiencesProps extends WithSiteId {}

export default async function Experiences({ siteId }: ExperiencesProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const experiences = await prisma.experience.findMany({
    where: {
      siteId,
    },
    orderBy: {
      startDate: "desc",
    },
    include: {
      skills: true,
    },
  });

  // const { data: experiences } = useSWR<
  //   Array<
  //     ExperienceType & {
  //       skills: Skill[];
  //     }
  //   >
  // >(sessionId && `/api/experience`, fetcher);

  console.log("experiences", siteId);

  return (
    <div className="-mt-3.5 flex flex-col divide-y divide-gray-200">
      {experiences ? (
        experiences.length > 0 ? (
          experiences.map((experience) => (
            <Experience
              key={experience.id}
              experience={experience}
              siteId={siteId}
            />
          ))
        ) : (
          <div className="text-center">
            <p className="font-cal text-xl text-gray-600">
              No experiences yet. Add one !
            </p>
          </div>
        )
      ) : (
        <ExperienceSkeleton />
      )}
    </div>
  );
}
