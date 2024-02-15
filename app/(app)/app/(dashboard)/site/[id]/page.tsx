import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

import Section from "@/components/section";

import {
  PORTFOLIO_SECTIONS_MAP,
  RESUME_SECTIONS_MAP,
} from "@/constants/builder";

import About from "@/components/builder/about";
import CurrentInfos from "@/components/builder/current-infos";
import Educations from "@/components/builder/educations";
import Experiences from "@/components/builder/experiences";
import Projects from "@/components/builder/projects";
import Languages from "@/components/builder/languages";
import Links from "@/components/builder/links";
import PersonalInfos from "@/components/builder/personal-infos";
import Skills from "@/components/builder/skills";

import AboutModal from "@/components/builder/Modals/about-modal";
import CurrentInfosModal from "@/components/builder/Modals/current-infos-modal";
import EducationModal from "@/components/builder/Modals/education-modal";
import ExperienceModal from "@/components/builder/Modals/experience-modal";
import LanguageModal from "@/components/builder/Modals/language-modal";
import LinkModal from "@/components/builder/Modals/link-modal";
import PersonalInfosModal from "@/components/builder/Modals/personal-infos-modal";
import ProjectModal from "@/components/builder/Modals/project-modal";
import DashboardContentTitle from "@/components/dashboard-content-title";
import SkillsModal from "@/components/builder/Modals/skills-modal";

const FIELD_SET_MAP = {
  "Personal Info": PersonalInfos,
  About: About,
  "Current Infos": CurrentInfos,
  Skills: Skills,
  Experiences: Experiences,
  Projects: Projects,
  Educations: Educations,
  Languages: Languages,
  Links: Links,
};

const FIELD_SET_EDIT_MODAL_MAP = {
  "Personal Info": PersonalInfosModal,
  About: AboutModal,
  Skills: SkillsModal,
  "Current Infos": CurrentInfosModal,
};
const FIELD_SET_ADD_MODAL_MAP = {
  Experiences: ExperienceModal,
  Projects: ProjectModal,
  Educations: EducationModal,
  Languages: LanguageModal,
  Links: LinkModal,
};

export default async function ResumeBuilder({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const siteId = decodeURIComponent(params.id);
  const data = await prisma.site.findUnique({
    where: {
      id: siteId,
    },
  });

  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  return (
    <>
      <DashboardContentTitle site={data} title={`Content for ${data.name}`} />
      <div className="min-h-screen rounded-lg border-stone-200 dark:border-stone-700 sm:border sm:bg-slate-100 sm:pb-10 sm:shadow-md dark:sm:bg-stone-900">
        <div className="mx-auto flex flex-col gap-3.5 sm:px-5 sm:py-20">
          {Object.values(
            data.type === "RESUME"
              ? RESUME_SECTIONS_MAP
              : PORTFOLIO_SECTIONS_MAP,
          ).map(({ name }, index) => {
            const Fieldset = FIELD_SET_MAP[name as keyof typeof FIELD_SET_MAP];
            const EditModal =
              FIELD_SET_EDIT_MODAL_MAP[
                name as keyof typeof FIELD_SET_EDIT_MODAL_MAP
              ];
            const AddModal =
              FIELD_SET_ADD_MODAL_MAP[
                name as keyof typeof FIELD_SET_ADD_MODAL_MAP
              ];
            return (
              <Section
                key={name}
                sectionName={name}
                editModal={EditModal}
                addModal={AddModal}
                site={data}
              >
                <>
                  <Fieldset siteId={siteId} />
                </>
              </Section>
            );
          })}
        </div>
      </div>
      {/* <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <h1 className="w-60 truncate font-cal text-xl font-bold dark:text-white sm:w-auto sm:text-3xl">
            All Posts for {data.name}
          </h1>
          <a
            href={
              process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `https://${url}`
                : `http://${data.subdomain}.localhost:3000`
            }
            target="_blank"
            rel="noreferrer"
            className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            {url} ↗
          </a>
        </div>
        <CreatePostButton />
      </div>
      <Posts siteId={decodeURIComponent(params.id)} /> */}
    </>
  );
}
