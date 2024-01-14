import { cn } from "@/lib/utils";
import { Skill as SkillType, Theme } from "@prisma/client";

interface SkillProps {
  skill: SkillType;
  theme?: Theme;
}

const Skill = ({ skill, theme }: SkillProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-normal",
        skill.primary
          ? "bg-gray-100 text-gray-800 dark:bg-white dark:text-gray-100"
          : "border border-gray-200 bg-gray-100 text-gray-600 dark:border-none dark:bg-gray-300 dark:text-gray-600",
      )}
      style={{
        color: theme?.contrastTextColor,
        backgroundColor: theme?.contrastColor,
      }}
    >
      {skill.name}
    </span>
  );
};

export default Skill;
