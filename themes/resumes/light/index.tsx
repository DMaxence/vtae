import CurrentInfosDisplay from "@/components/displayer/current-infos";
import Education from "@/components/displayer/education";
import Experience from "@/components/displayer/experience";
import Language from "@/components/displayer/language";
import Link from "@/components/displayer/link";
import PersonalInfos from "@/components/displayer/personal-infos";
import Skill from "@/components/displayer/skill";
import Section from "@/components/section";
import { getExperienceYears } from "@/lib/utils";
import {
  Education as EducationType,
  Experience as ExperienceType,
  Language as LanguageType,
  PersonalInfos as PersonalInfosType,
  Project as ProjectType,
  Site as SiteType,
  Skill as SkillType,
  User as UserType,
  Link as LinkType,
} from "@prisma/client";
import Footer from "./footer";

type ThemeProps = {
  site: SiteType & {
    user: UserType;
    experiences: (ExperienceType & {
      skills: SkillType[];
    })[];
    skills: SkillType[];
    personalInfos: PersonalInfosType;
    educations: EducationType[];
    projects: ProjectType[];
    languages: LanguageType[];
    links: LinkType[];
  };
};

export default function Theme({ site }: ThemeProps) {
  const skillsWithDuplicates = site.experiences.map((exp) => exp.skills).flat();

  const skills = [
    ...new Map(skillsWithDuplicates.map((item) => [item.id, item])).values(),
  ];

  const experienceYears = getExperienceYears(site.experiences);

  return (
    <>
      <div className="my-20 w-full print:my-0">
        <div className="mx-auto w-full max-w-screen-sm print:mx-0 print:!w-full print:max-w-none print:divide-y print:divide-gray-200 print:p-0 lg:w-5/6">
          {site?.personalInfos && (
            <>
              {site.personalInfos?.firstname && site.user && (
                <Section>
                  <PersonalInfos
                    personalInfos={site.personalInfos}
                    user={site.user}
                    experience={experienceYears}
                  />
                </Section>
              )}
              {site.personalInfos?.about && (
                <Section sectionName="About">
                  <p className="whitespace-pre-line text-justify">
                    {site.personalInfos.about}
                  </p>
                </Section>
              )}
              {(site.personalInfos?.location ||
                site.personalInfos?.currentWork) && (
                <Section sectionName="Current Infos" hidePrint>
                  <CurrentInfosDisplay personalInfos={site.personalInfos} />
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

          {site?.experiences?.length > 0 && (
            <Section sectionName="Experiences">
              <div className="-mt-3.5 flex flex-col divide-y divide-gray-200">
                {site.experiences.map((experience) => (
                  <Experience
                    key={experience.id}
                    experience={experience}
                    readOnly
                  />
                ))}
              </div>
            </Section>
          )}

          {site?.educations?.length > 0 && (
            <Section sectionName="Educations">
              <div className="-mt-3.5 flex flex-col divide-y divide-gray-200">
                {site.educations.map((education) => (
                  <Education
                    key={education.id}
                    education={education}
                    readOnly
                  />
                ))}
              </div>
            </Section>
          )}

          {site?.languages?.length > 0 && (
            <Section sectionName="Language">
              <div className="-mt-3.5 flex flex-col">
                {site.languages.map((language) => (
                  <Language key={language.id} language={language} readOnly />
                ))}
              </div>
            </Section>
          )}
          {site?.links?.length > 0 && (
            <Section sectionName="Links">
              <div className="-mt-3.5 flex flex-col">
                {site.links.map((link) => (
                  <Link key={link.id} link={link} readOnly />
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
