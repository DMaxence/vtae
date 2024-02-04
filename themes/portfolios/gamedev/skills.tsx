import { MaxWidthWrapper } from "@/components/home/max-width-wrapper";
import { cn } from "@/lib/utils";
import { Project, Site, Skill } from "@prisma/client";
import styles from "./gamedev.module.scss";

type SkillsProps = {
  site: Site & {
    projects: (Project & {
      skills: Skill[];
    })[];
  };
};

export default function Skills({ site }: SkillsProps) {
  const skills = site.projects.reduce((acc, project) => {
    project.skills.forEach((skill) => {
      if (!acc.find((s) => s.id === skill.id)) {
        acc.push(skill);
      }
    });
    return acc;
  }, [] as Skill[]);

  return (
    <MaxWidthWrapper
      id="skills"
      className={cn(styles.skillsContainer, "my-10")}
    >
      <div className="flex flex-col gap-3.5 pb-20 pt-10">
        <div className="text-center text-4xl font-bold uppercase text-white">
          Skills
        </div>
        <hr className="mb-5 w-[100px] self-center border-[#F15050]" />
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3">
          {skills.map((skill, i) => (
            <div key={i} className="text-white">
              &ndash; {skill.name}
            </div>
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
