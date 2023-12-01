import type { PersonalInfos as PersonalInfosType, Theme } from "@prisma/client";

import BlurImage from "@/components/blur-image";
import { cn } from "@/lib/utils";

interface PersonalInfosSectionProps {
  personalInfos?: PersonalInfosType;
  image?: string | null;
  experience?: number;
  theme?: Theme;
}

const PersonalInfos = ({
  personalInfos,
  image,
  experience,
  theme,
}: PersonalInfosSectionProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-block h-20 w-20 overflow-hidden rounded-full align-middle">
        {personalInfos?.image || image ? (
          <BlurImage
            alt={personalInfos?.firstname ?? "User Avatar"}
            height={80}
            width={80}
            src={personalInfos?.image || image || ""}
            blurDataURL={personalInfos?.imageBlurhash ?? undefined}
            placeholder={personalInfos?.imageBlurhash ? "blur" : "empty"}
            // layout="responsive"
            // objectFit="cover"
          />
        ) : (
          <div className="absolute flex h-full w-full select-none items-center justify-center bg-gray-100 text-4xl text-gray-500">
            ?
          </div>
        )}
      </div>
      <h1
        className={cn(
          "text-xl font-bold",
          personalInfos?.firstname ? "" : "text-gray-500",
        )}
      >
        {personalInfos?.firstname
          ? `${personalInfos?.firstname} ${personalInfos?.lastname}`
          : "Name"}
      </h1>
      {personalInfos?.alias && <i>(Aka {personalInfos.alias})</i>}
      <div className="text-center text-xl">{personalInfos?.title}</div>
      {experience ? (
        <div className="text-center">
          <span className="font-bold">
            {experience > 1 ? `${experience} years` : `${experience} year`}
          </span>{" "}
          of experience
        </div>
      ) : null}
    </div>
  );
};

export default PersonalInfos;
