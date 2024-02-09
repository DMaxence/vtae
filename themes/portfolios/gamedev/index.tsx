import {
  Media,
  PersonalInfos,
  Project,
  ProjectCategory,
  Site,
  Skill,
  ThemeConfig,
  User,
} from "@prisma/client";
import { Header } from "./header";
import Hero from "./hero";
import styles from "./gamedev.module.scss";
import BrandList from "./brand-list";
import Projects from "./projects";
import { cn } from "@/lib/utils";
import Skills from "./skills";
import About from "./about";
import Footer from "./footer";
import { montserrat } from "@/styles/fonts";

type ThemeProps = {
  site: Site & {
    user: User;
    projects: (Project & {
      skills: Skill[];
      category: ProjectCategory;
      medias: Media[];
    })[];
    personalInfos: PersonalInfos;
    iconsList: Media[];
    themeConfig: ThemeConfig
  };
};

export default function Theme({ site }: ThemeProps) {
  return (
    <div className={cn(styles.container, montserrat.variable, 'font-montserrat')}>
      <Header site={site} />
      <Hero site={site} />
      <BrandList site={site} />
      <Projects site={site} />
      <Skills site={site} />
      <About site={site} />
      <Footer site={site} />
    </div>
  );
}
