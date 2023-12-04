"use client";
import React from "react";

import type { WithChildren, WithShowModal } from "@/lib/types";
import { Theme as ThemeType, Site } from "@prisma/client";
import { PenSquare, Plus } from "lucide-react";
import { useModal } from "./modal/provider";
import { WithSiteId } from "@/lib/types";

interface SectionProps extends WithChildren {
  theme?: ThemeType;
  sectionName?: string;
  description?: string;
  editModal?: React.FC<WithSiteId & WithShowModal>;
  addModal?: React.FC<WithSiteId & WithShowModal>;
  site: Site;
}

export default function Section({
  children,
  theme,
  sectionName,
  description,
  editModal: EditModal,
  addModal: AddModal,
  site,
}: SectionProps) {
  const [showModal, setShowModal] = React.useState<boolean>(false);

  return (
    <section
      className="flex flex-col gap-3.5 rounded-lg bg-white p-5 shadow-md dark:bg-black"
      style={{ backgroundColor: theme?.bgColor }}
    >
      <div className="flex justify-between">
        <h2
          className="text-lg font-bold text-gray-600 dark:text-gray-100"
          style={{ color: theme?.titleColor }}
        >
          {sectionName}
        </h2>
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
      {description && (
        <p
          className="text-sm text-gray-600 dark:text-gray-100"
          style={{ color: theme?.titleColor }}
        >
          {description}
        </p>
      )}
      <div className="">{children}</div>
      {EditModal && (
        <EditModal
          siteId={site.id}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      {AddModal && (
        <AddModal
          siteId={site.id}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </section>
  );
}
