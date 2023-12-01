"use client";
import type { Language as LanguageType, Theme } from "@prisma/client";

import { countryCodeToDisplayLanguageMap } from "@/constants/countryCodeToDisplayLanguageMap";
import { PenSquare } from "lucide-react";
import LanguageModal from "../builder/Modals/language-modal";
import { useModal } from "../modal/provider";
import { WithSiteId } from "@/lib/types";

interface LanguageProps extends WithSiteId {
  language: LanguageType;
  readOnly?: boolean;
  theme?: Theme;
}

export default function Language({
  siteId,
  language,
  readOnly,
  theme,
}: LanguageProps) {
  const modal = useModal();
  return (
    <div className="flex flex-col gap-3.5 py-2.5 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between">
        <div className="flex gap-3.5">
          <div
            className="w-[150px] text-gray-700 dark:text-gray-200"
            style={{ color: theme?.textColor, opacity: 0.8 }}
          >
            {countryCodeToDisplayLanguageMap[language.name]}
          </div>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={() =>
              modal?.show(
                <LanguageModal siteId={siteId} languageId={language.id} />,
              )
            }
          >
            <PenSquare className="h-5 w-5 text-gray-500 dark:text-gray-100" />
          </button>
        )}
      </div>
    </div>
  );
}
