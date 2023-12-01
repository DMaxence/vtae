import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import Language from "../displayer/language";
import { WithSiteId } from "@/lib/types";

interface LanguageProps extends WithSiteId {}

export default async function Languages({ siteId }: LanguageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const languages = await prisma.language.findMany({
    where: {
      user: {
        sites: {
          some: {
            id: siteId,
          },
        },
      },
    },
  });
  // const { data: session } = useSession();

  // const sessionId = session?.user?.id;

  // const { data: languages } = useSWR<Array<LanguageType>>(
  //   sessionId && `/api/language`,
  //   fetcher,
  // );

  return (
    <div className="-mt-3.5 flex flex-col divide-y divide-gray-200">
      {languages &&
        (languages.length > 0 ? (
          languages.map((language) => (
            <Language key={language.id} siteId={siteId} language={language} />
          ))
        ) : (
          <p className="whitespace-pre-line text-sm text-gray-400">
            No language yet. Add one !
          </p>
        ))}
    </div>
  );
}
