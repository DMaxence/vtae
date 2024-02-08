"use client";

import { updateSite } from "@/lib/actions";
import { LoadingDots } from "@/lib/icons";
import { cn } from "@/utils";
import { Site } from "@prisma/client";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type CTAProps = {
  site: Site;
};

export default function CTA({ site }: CTAProps) {
  let [isPendingPublishing, startTransitionPublishing] = useTransition();
  const [data, setData] = useState<Site>(site);
  const [closeCTA, setCloseCTA] = useState(false);

  return (
    <div
      className={`${
        closeCTA ? "h-14 lg:h-auto" : "h-44 sm:h-40 lg:h-auto"
      } fixed inset-x-0 bottom-5 mx-5 flex max-w-screen-xl flex-col items-center justify-between space-y-3 rounded-lg border-t-4 border-black bg-white px-5 pb-3 pt-0 drop-shadow-lg transition-all duration-150 ease-in-out dark:border dark:border-t-4 dark:border-stone-700 dark:bg-black dark:text-white
          lg:flex-row lg:space-y-0 lg:pt-3 xl:mx-auto`}
    >
      <button
        onClick={() => setCloseCTA(!closeCTA)}
        className={`${
          closeCTA ? "rotate-180" : "rotate-0"
        } absolute right-3 top-2 text-black transition-all duration-150 ease-in-out dark:text-white lg:hidden`}
      >
        <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className="text-center lg:text-left">
        <p className="font-title text-lg text-black dark:text-white sm:text-2xl">
          Preview
        </p>
        <p
          className={`${
            closeCTA ? "hidden lg:block" : ""
          } mt-2 text-sm text-stone-700 dark:text-stone-300 lg:mt-0`}
        >
          This is a preview of your site, only you can see this. If you want to
          publish your site, click the button on the right.
        </p>
      </div>
      <div
        className={`${
          closeCTA ? "hidden lg:flex" : ""
        } flex w-full flex-col space-y-3 text-center sm:flex-row sm:space-x-3 sm:space-y-0 lg:w-auto`}
      >
        <button
          onClick={() => {
            const formData = new FormData();
            formData.append("published", String(!data.published));
            startTransitionPublishing(async () => {
              await updateSite(formData, site.id, "published").then(() => {
                toast.success(
                  `Successfully ${
                    data.published ? "unpublished" : "published"
                  } your site.`,
                );
                setData((prev) => ({ ...prev, published: !prev.published }));
              });
            });
          }}
          className={cn(
            "flex items-center justify-center space-x-2 rounded-lg border px-5 py-1 transition-all focus:outline-none sm:py-3",
            isPendingPublishing
              ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              : "border border-black bg-black text-white hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
          )}
          disabled={isPendingPublishing}
        >
          {isPendingPublishing ? (
            <LoadingDots />
          ) : (
            <p>{data.published ? "Unpublish" : "Publish"}</p>
          )}
        </button>
      </div>
    </div>
  );
}
