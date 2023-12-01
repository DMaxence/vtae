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
  editModal?: React.FC<WithSiteId>;
  addModal?: React.FC<WithSiteId>;
  site: Site;
}

function EditButton({ children }: { children: React.ReactNode }) {
  const modal = useModal();
  return (
    <button
      onClick={() => modal?.show(children)}
      // className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
    >
      <PenSquare className="h-5 w-5 text-gray-500 dark:text-gray-100" />
    </button>
  );
}

function AddButton({ children }: { children: React.ReactNode }) {
  const modal = useModal();
  return (
    <button
      onClick={() => modal?.show(children)}
      // className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
    >
      <Plus className="h-5 w-5 text-gray-500 dark:text-gray-100" />
    </button>
  );
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
  // const [showModal, setShowModal] = React.useState<boolean>(false);

  return (
    <section
      className="rounded-lg bg-white p-5 shadow-md dark:bg-black"
      style={{ backgroundColor: theme?.bgColor }}
    >
      <div className="flex justify-between">
        <h2
          className="text-lg font-bold text-gray-600 dark:text-gray-100"
          style={{ color: theme?.titleColor }}
        >
          {sectionName}
        </h2>
        {EditModal && (
          <EditButton>
            <EditModal siteId={site.id} />
          </EditButton>
        )}
        {AddModal && (
          <AddButton>
            <AddModal siteId={site.id} />
          </AddButton>
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
      <div className="mt-3.5">{children}</div>
      {/* {EditModal && (
        <EditModal showModal={showModal} setShowModal={setShowModal} />
      )}
      {AddModal && (
        <AddModal showModal={showModal} setShowModal={setShowModal} />
      )} */}
    </section>
  );
}
