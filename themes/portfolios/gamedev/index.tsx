import {
  Media,
  PersonalInfos,
  Project,
  ProjectCategory,
  Site,
  Skill,
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

type ThemeProps = {
  site: Site & {
    user: User;
    projects: (Project & {
      skills: Skill[];
      category: ProjectCategory;
      media: Media[];
    })[];
    personalInfos: PersonalInfos;
  };
};

export default function Theme({ site }: ThemeProps) {
  return (
    <div className={cn(styles.container, "font-title")}>
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
