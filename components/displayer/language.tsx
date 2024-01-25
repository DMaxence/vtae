"use client";
import type { Language as LanguageType, Theme } from "@prisma/client";
import React from "react";

import { countryCodeToDisplayLanguageMap } from "@/constants/countryCodeToDisplayLanguageMap";
import { PenSquare } from "lucide-react";
import LanguageModal from "../builder/Modals/language-modal";

import { WithOptionalSiteId } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LanguageProps extends WithOptionalSiteId {
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
  const [showModal, setShowModal] = React.useState<boolean>(false);

  return (
    <div className={cn({ "py-1.5 first:pt-0 last:pb-0": !readOnly })}>
      <div className="flex items-center justify-between">
        <div className="flex gap-3.5">
          <div
            className={cn("w-[150px]", {
              "text-gray-700 dark:text-gray-200": !readOnly,
            })}
            // style={{ color: theme?.textColor, opacity: 0.8 }}
          >
            {readOnly ? "- " : ""}
            {
              countryCodeToDisplayLanguageMap[
                language.name as keyof typeof countryCodeToDisplayLanguageMap
              ]
            }
          </div>
        </div>
        {!readOnly && (
          <div>
            <button type="button" onClick={() => setShowModal(true)}>
              <PenSquare className="h-5 w-5 text-gray-500 dark:text-gray-100" />
            </button>
          </div>
        )}
      </div>
      {!readOnly && siteId && (
        <LanguageModal
          siteId={siteId}
          languageId={language.id}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
    </div>
  );
}
