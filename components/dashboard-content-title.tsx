"use client";
import { updateSite } from "@/lib/actions";
import { LoadingDots } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Site } from "@prisma/client";
import { ExternalLink } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type DashboardContentTitle = {
  site: Site;
  title: string;
};

export default function DashboardContentTitle({
  site,
  title,
}: DashboardContentTitle) {
  let [isPendingPublishing, startTransitionPublishing] = useTransition();
  const [data, setData] = useState<Site>(site);

  const subUrl = `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  const url = site.customDomain ?? subUrl;

  return (
    <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
      <h1 className="w-60 truncate font-cal text-xl font-bold dark:text-white sm:w-auto sm:text-3xl">
        {title}
      </h1>
      {data.published && (
        <a
          href={
            process.env.NEXT_PUBLIC_VERCEL_ENV
              ? `https://${url}`
              : `http://${site.subdomain}.localhost:3000`
          }
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
        >
          {url} ↗
        </a>
      )}

      <div className="flex items-center space-x-3 sm:!ml-auto">
        {!data.published && (
          <a
            href={
              process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `https://${url}`
                : `http://${site.subdomain}.localhost:3000`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-stone-400 hover:text-stone-500"
          >
            <p>Preview</p>
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
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
            "flex h-7 w-24 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none",
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
