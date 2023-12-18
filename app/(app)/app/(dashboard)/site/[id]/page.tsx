import CreatePostButton from "@/components/create-post-button";
import Posts from "@/components/posts";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

import Section from "@/components/section";

import { SECTIONS_MAP } from "@/constants/builder";

import About from "@/components/builder/about";
import CurrentInfos from "@/components/builder/current-infos";
import Educations from "@/components/builder/educations";
import Experiences from "@/components/builder/experiences";
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
import { getClient } from "@umami/api-client";

const FIELD_SET_MAP = {
  [SECTIONS_MAP.PERSONAL_INFOS.name]: PersonalInfos,
  [SECTIONS_MAP.ABOUT.name]: About,
  [SECTIONS_MAP.CURRENT_INFOS.name]: CurrentInfos,
  [SECTIONS_MAP.SKILLS.name]: Skills,
  [SECTIONS_MAP.EXPERIENCES.name]: Experiences,
  // // [SECTIONS_MAP.PROJECTS.name]: Experience,
  [SECTIONS_MAP.EDUCATION.name]: Educations,
  [SECTIONS_MAP.LANGUAGES.name]: Languages,
  [SECTIONS_MAP.LINKS.name]: Links,
};

const FIELD_SET_EDIT_MODAL_MAP = {
  [SECTIONS_MAP.PERSONAL_INFOS.name]: PersonalInfosModal,
  [SECTIONS_MAP.ABOUT.name]: AboutModal,
  [SECTIONS_MAP.CURRENT_INFOS.name]: CurrentInfosModal,
};
const FIELD_SET_ADD_MODAL_MAP = {
  [SECTIONS_MAP.EXPERIENCES.name]: ExperienceModal,
  [SECTIONS_MAP.EDUCATION.name]: EducationModal,
  [SECTIONS_MAP.LANGUAGES.name]: LanguageModal,
  [SECTIONS_MAP.LINKS.name]: LinkModal,
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

  // const client = getClient({
  //   userId: process.env.UMAMI_API_CLIENT_USER_ID,
  //   // secret: process.env.UMAMI_API_CLIENT_SECRET,
  //   // apiEndpoint: process.env.UMAMI_API_CLIENT_ENDPOINT,
  // });
  // const website = await client.getWebsites();
  // console.log("client", client, website);

  const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <>
      <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
        <h1 className="w-60 truncate font-cal text-xl font-bold dark:text-white sm:w-auto sm:text-3xl">
          Content for {data.name}
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
      <div className="min-h-screen rounded-lg border border-stone-200 bg-slate-100 pb-10 shadow-md dark:border-stone-700 dark:bg-stone-900">
        <div className="mx-auto flex flex-col gap-3.5 px-5 py-20 sm:px-20">
          {Object.values(SECTIONS_MAP).map(({ name }, index) => {
            const Fieldset = FIELD_SET_MAP[name];
            const EditModal = FIELD_SET_EDIT_MODAL_MAP[name];
            const AddModal = FIELD_SET_ADD_MODAL_MAP[name];
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
