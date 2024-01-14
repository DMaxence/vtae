import type {
  PersonalInfos as PersonalInfosType,
  Theme,
  User,
} from "@prisma/client";

import BlurImage from "@/components/blur-image";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface PersonalInfosSectionProps {
  personalInfos?: PersonalInfosType;
  user?: User;
  experience?: number;
  theme?: Theme;
}

const PersonalInfos = ({
  personalInfos,
  user,
  experience,
  theme,
}: PersonalInfosSectionProps) => {
  return (
    <div className="flex flex-col items-center print:items-start">
      <div className="relative inline-block h-20 w-20 overflow-hidden rounded-full align-middle print:hidden">
        <Image
          alt={personalInfos?.firstname ?? "User Avatar"}
          height={80}
          width={80}
          src={
            personalInfos?.image ||
            user?.image ||
            `https://avatar.vercel.sh/${user?.email}`
          }
          blurDataURL={personalInfos?.imageBlurhash ?? undefined}
          placeholder={personalInfos?.imageBlurhash ? "blur" : "empty"}
          // layout="responsive"
          // objectFit="cover"
        />
      </div>
      <h1
        className={cn(
          "text-xl font-bold print:text-2xl",
          personalInfos?.firstname ? "" : "text-gray-500",
        )}
      >
        {personalInfos?.firstname
          ? `${personalInfos?.firstname} ${personalInfos?.lastname ?? ""}`
          : "Name"}
      </h1>
      {personalInfos?.alias && (
        <i className="print:hidden">(Aka {personalInfos.alias})</i>
      )}
      <div className="text-center text-xl print:text-lg">
        {personalInfos?.title}
      </div>
      <div className="hidden items-center gap-1 print:flex">
        <MapPin className="inline-block h-4 w-4 text-gray-500 dark:text-gray-100" />
        <span className="text-gray-500 dark:text-gray-100">
          {personalInfos?.location}
        </span>
      </div>
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
