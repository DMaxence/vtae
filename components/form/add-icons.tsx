"use client";
import React from "react";

import { nanoid } from "@/utils";
import { Media, Site } from "@prisma/client";
import { FileInput, Label } from "flowbite-react";
import { XCircleIcon } from "lucide-react";
import { toast } from "sonner";

import LoadingDots from "@/components/icons/loading-dots";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

interface AddIconsProps {
  site: Site & {
    iconsList: Media[];
  };
}

export default function AddIcons({ site }: AddIconsProps) {
  const router = useRouter();
  const { update } = useSession();
  const [medias, setMedias] = React.useState(
    site.iconsList as (Media & {
      image: string;
    })[],
  );
  const [mediasToRemove, setMediasToRemove] = React.useState<string[]>([]);

  const removeMedia = (id: string) => {
    setMediasToRemove([...mediasToRemove, id]);
  };
  return (
    <form
      action={async (data: FormData) => {
        const res = await fetch(`/api/builder/${site.id}/icons-list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mediasToRemove, medias }),
        });
        if (!res.ok) {
          console.log("error", res.statusText);
          toast.error(res.statusText);
        } else {
          await update();
          router.refresh();
          toast.success(`Successfully updated icons!`);
        }
      }}
      className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-black"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-cal text-xl dark:text-white">Icons</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Add a list of icons to your portfolio such as brand icons or tools you
          use.
        </p>
        <Label
          htmlFor="dropzone-file"
          className="dark:hover:bg-bray-800 flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-stone-600 dark:bg-stone-700 dark:hover:border-stone-500 dark:hover:bg-stone-600"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <p className="mb-1.5 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG (MAX. 1MB EACH)
            </p>
          </div>

          <FileInput
            id="dropzone-file"
            sizing="sm"
            accept="image/png"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size / 1024 / 1024 > 1) {
                  toast.error("File size too big (max 1MB)");
                } else {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setMedias([
                      ...(medias?.length ? medias : []),
                      {
                        id: nanoid(),
                        type: "IMAGE",
                        image: e.target?.result as string,
                      } as Media & { image: string },
                    ]);
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
          />
        </Label>
        <div className="flex w-full gap-3.5 overflow-x-scroll">
          {medias?.map((media) => (
            <div key={media.id} className="relative shrink-0">
              <img
                src={media.url || media.image}
                className="h-32 w-32 rounded-lg object-cover"
                alt=""
                draggable
              />
              <button
                type="button"
                onClick={() => {
                  setMedias(medias.filter((m) => m.id !== media.id));
                  removeMedia(media.id);
                }}
                className="absolute right-1.5 top-1.5 text-sm text-red-500 shadow transition-all hover:text-red-600"
              >
                <XCircleIcon />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Max file size 1MB each. Recommended maximum size 200x200.
        </p>
        <FormButton />
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-8 w-32 items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
      )}
      disabled={pending}
    >
      {pending ? <LoadingDots type="gray" /> : <p>Save Changes</p>}
    </button>
  );
}
