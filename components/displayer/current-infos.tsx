import type { PersonalInfos, Theme } from "@prisma/client";
import { Briefcase, Building, MapPinned } from "lucide-react";

interface CurrentInfosProps {
  personalInfos?: PersonalInfos;
  theme?: Theme;
}

export default function CurrentInfosDisplay({
  personalInfos,
  theme,
}: CurrentInfosProps) {
  return (
    <div className="flex flex-col gap-3.5">
      {personalInfos?.location && (
        <p className="flex gap-1.5">
          <MapPinned size={22} className="stroke-gray-500 dark:stroke-gray-200" />
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 320 512"
            className="fill-gray-500 dark:fill-gray-200"
            style={{ fill: theme?.accentColor }}
          >
            <path d="M320 144c0 79.5-64.5 144-144 144S32 223.5 32 144S96.5 0 176 0s144 64.5 144 144zM176 80c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96c0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zM144 480V317.1c10.4 1.9 21.1 2.9 32 2.9s21.6-1 32-2.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32z" />
          </svg> */}
          {personalInfos.location}
        </p>
      )}
      {personalInfos?.currentWork && (
        <p className="flex gap-1.5">
          <Briefcase size={22} className="stroke-gray-500 dark:stroke-gray-200" />
          {personalInfos.currentWork}
        </p>
      )}
    </div>
  );
}
