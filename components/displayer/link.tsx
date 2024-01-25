"use client";
import type { Link as LinkType, Theme } from "@prisma/client";

import { WithOptionalSiteId } from "@/lib/types";
import { getClickableLink } from "@/lib/utils";
import { PenSquare } from "lucide-react";

import React from "react";
import LinkModal from "../builder/Modals/link-modal";

interface LinkProps extends WithOptionalSiteId {
  link: LinkType;
  readOnly?: boolean;
  theme?: Theme;
}

export default function Link({ siteId, link, readOnly, theme }: LinkProps) {
  const [showModal, setShowModal] = React.useState<boolean>(false);

  return (
    <div className="flex flex-col gap-3.5 py-2.5 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between">
        <div className="flex gap-3.5">
          <div
            className="w-[150px] text-gray-700 dark:text-gray-200"
            // style={{ color: theme?.textColor, opacity: 0.8 }}
          >
            {link.name}
          </div>
          <a
            className="link"
            href={getClickableLink(link.url)}
            target="_blank"
            rel="noopener noreferrer"
            // style={{ color: theme?.linkColor }}
          >
            {link?.alt ? link.alt : link.url}
          </a>
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
        <LinkModal
          siteId={siteId}
          linkId={link.id}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
    </div>
  );
}
