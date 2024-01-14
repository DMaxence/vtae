import CurrentInfosDisplay from "@/components/displayer/current-infos";
import Education from "@/components/displayer/education";
import Experience from "@/components/displayer/experience";
import Language from "@/components/displayer/language";
import Link from "@/components/displayer/link";
import PersonalInfos from "@/components/displayer/personal-infos";
import Skill from "@/components/displayer/skill";
import Section from "@/components/section";
import { getSiteData } from "@/lib/fetchers";
import prisma from "@/lib/prisma";
import { getExperienceYears } from "@/lib/utils";
import { notFound } from "next/navigation";

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

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);
  // const [data, posts] = await Promise.all([
  //   getSiteData(domain),
  //   getPostsForSite(domain),
  // ]);

  if (!data) {
    notFound();
  }

  const skillsWithDuplicates = data.experiences.map((exp) => exp.skills).flat();

  const skills = [
    ...new Map(skillsWithDuplicates.map((item) => [item.id, item])).values(),
  ];

  const experienceYears = getExperienceYears(data.experiences);

  return (
    <div className="mb-20 w-full print:mb-0">
      <div className="mx-auto w-full max-w-screen-sm print:mx-0 print:!w-full print:max-w-none print:divide-y print:divide-gray-200 print:p-0 lg:w-5/6">
        {data?.personalInfos && (
          <>
            {data.personalInfos?.firstname && data.user && (
              <Section>
                <PersonalInfos
                  personalInfos={data.personalInfos}
                  user={data.user}
                  experience={experienceYears}
                />
              </Section>
            )}
            {data.personalInfos?.about && (
              <Section sectionName="About">
                <p className="whitespace-pre-line text-justify">
                  {data.personalInfos.about}
                </p>
              </Section>
            )}
            {(data.personalInfos?.location ||
              data.personalInfos?.currentWork) && (
              <Section sectionName="Current Infos" hidePrint>
                <CurrentInfosDisplay personalInfos={data.personalInfos} />
              </Section>
            )}
          </>
        )}

        {skills?.length > 0 && (
          <Section sectionName="Skills">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Skill key={skill.id} skill={skill} />
              ))}
            </div>
          </Section>
        )}

        {data?.experiences?.length > 0 && (
          <Section sectionName="Experiences">
            <div className="-mt-3.5 flex flex-col divide-y divide-gray-200">
              {data.experiences.map((experience) => (
                <Experience
                  key={experience.id}
                  experience={experience}
                  readOnly
                />
              ))}
            </div>
          </Section>
        )}

        {data?.educations?.length > 0 && (
          <Section sectionName="Educations">
            <div className="-mt-3.5 flex flex-col divide-y divide-gray-200">
              {data.educations.map((education) => (
                <Education key={education.id} education={education} readOnly />
              ))}
            </div>
          </Section>
        )}

        {data?.languages?.length > 0 && (
          <Section sectionName="Language">
            <div className="-mt-3.5 flex flex-col">
              {data.languages.map((language) => (
                <Language key={language.id} language={language} readOnly />
              ))}
            </div>
          </Section>
        )}
        {data?.links?.length > 0 && (
          <Section sectionName="Links">
            <div className="-mt-3.5 flex flex-col">
              {data.links.map((link) => (
                <Link key={link.id} link={link} readOnly />
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
