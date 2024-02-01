export const RESUME_SECTIONS_MAP = {
  PERSONAL_INFOS: {
    name: "Personal Info",
    required: true,
  },
  ABOUT: {
    name: "About",
    required: true,
  },
  CURRENT_INFOS: {
    name: "Current Infos",
  },
  SKILLS: {
    name: "Skills",
    required: true,
  },
  EXPERIENCES: {
    name: "Experiences",
  },
  // // PROJECTS: {
  // //   name: 'Personal Projects',
  // //   description:
  // //     'Remote workers often use personal projects to prove their personal time management and collaboration skills. If you have some, you should include them!',
  // // },
  EDUCATION: {
    name: "Educations",
  },
  LANGUAGES: {
    name: "Languages",
  },
  LINKS: {
    name: "Links",
  },
};

export const PORTFOLIO_SECTIONS_MAP = {
  PERSONAL_INFOS: {
    name: "Personal Info",
    required: true,
  },
  ABOUT: {
    name: "About",
    required: true,
  },
  SKILLS: {
    name: "Skills",
    required: true,
  },
  PROJECTS: {
    name: "Projects",
    description:
      "Remote workers often use personal projects to prove their personal time management and collaboration skills. If you have some, you should include them!",
  },
};

export const RESUME_SECTION_NAMES = Object.values(RESUME_SECTIONS_MAP).map(
  (section) => section.name,
);

export const PORTFOLIO_SECTION_NAMES = Object.values(
  PORTFOLIO_SECTIONS_MAP,
).map((section) => section.name);
