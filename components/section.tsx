"use client";
import React from "react";

import type { WithChildren, WithShowModal } from "@/lib/types";
import { Theme as ThemeType, Site } from "@prisma/client";
import { PenSquare, Plus } from "lucide-react";
import { useModal } from "./modal/provider";
import { WithSiteId } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SectionProps extends WithChildren {
  theme?: ThemeType;
  sectionName?: string;
  description?: string;
  editModal?: React.FC<WithSiteId & WithShowModal>;
  addModal?: React.FC<WithSiteId & WithShowModal>;
  site?: Site;
  hidePrint?: boolean;
}

export default function Section({
  children,
  theme,
  sectionName,
  description,
  editModal: EditModal,
  addModal: AddModal,
  site,
  hidePrint,
}: SectionProps) {
  const [showModal, setShowModal] = React.useState<boolean>(false);

  return (
    <section
      className={cn(
        "flex flex-col gap-3.5 bg-white p-5 dark:bg-black dark:first:rounded-t-lg dark:last:rounded-b-lg print:px-0 print:py-3.5",
        site ? "rounded-lg shadow-md" : "",
        { "print:hidden": hidePrint },
      )}
      style={{ backgroundColor: theme?.bgColor }}
    >
      {(sectionName || EditModal || AddModal) && (
        <div className="flex justify-between">
          {sectionName && (
            <h2
              className="text-lg font-bold text-gray-600 dark:text-gray-100 print:mb-3.5 print:text-base print:font-semibold print:uppercase print:tracking-[2px] print:text-gray-400"
              style={{ color: theme?.titleColor }}
            >
              {sectionName}
            </h2>
          )}
          {(EditModal || AddModal) && (
            <button type="button" onClick={() => setShowModal(!showModal)}>
              {EditModal ? (
                <PenSquare className="h-5 w-5 text-gray-500 dark:text-gray-100" />
              ) : (
                <Plus className="h-5 w-5 text-gray-500 dark:text-gray-100" />
              )}
            </button>
          )}
        </div>
      )}
      {description && (
        <p
          className="text-sm text-gray-600 dark:text-gray-100"
          style={{ color: theme?.titleColor }}
        >
          {description}
        </p>
      )}
      <div className="">{children}</div>
      {EditModal && site && (
        <EditModal
          siteId={site.id}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      {AddModal && site && (
        <AddModal
          siteId={site.id}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </section>
  );
}
