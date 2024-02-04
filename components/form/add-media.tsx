"use client";
import React from "react";

import { FormFieldsType } from "@/lib/types";
import { nanoid } from "@/utils";
import { Media } from "@prisma/client";
import { FileInput, Label } from "flowbite-react";
import { useField } from "formik";
import { FileVideo2, ImagePlus, XCircleIcon } from "lucide-react";
import { toast } from "sonner";

interface AddMediaProps extends FormFieldsType {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  exists?: boolean;
  existingMedias?: Array<Media>;
}

export default function AddMedia({
  setFieldValue,
  exists,
  existingMedias,
  ...props
}: AddMediaProps) {
  const [field] = useField(props);
  const [videoUrl, setVideoUrl] = React.useState<string>("");
  const [showImageDropzone, setShowImageDropzone] = React.useState(false);
  const [showVideoInput, setShowVideoInput] = React.useState(false);
  const medias = React.useMemo(
    () => field.value || [],
    [field.value],
  ) as (Media & { image: string })[];

  const addVideo = () => {
    setFieldValue("medias", [
      ...(medias?.length ? medias : []),
      {
        id: nanoid(),
        type: "VIDEO",
        image: videoUrl,
      },
    ]);
    setVideoUrl("");
    setShowVideoInput(false);
  };
  console.log("medias", medias);

  React.useEffect(() => {
    if (exists) {
      const removeMedias = existingMedias
        ?.filter((media) => !medias?.find((m) => m.id === media.id))
        ?.map((media) => media.id);
      setFieldValue("removeMedias", removeMedias);
    }
  }, [setFieldValue, medias, exists, existingMedias]);

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="text-left">Add images or videos to your project</div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setShowImageDropzone(!showImageDropzone)}
            className="rounded-lg bg-gray-200 px-5 py-1.5 transition-all hover:bg-gray-300 dark:bg-stone-700 dark:hover:bg-stone-600"
          >
            <ImagePlus className="h-5 w-5 text-gray-500 dark:text-gray-200" />
          </button>
          <button
            type="button"
            onClick={() => setShowVideoInput(!showVideoInput)}
            className="rounded-lg bg-gray-200 px-5 py-1.5 transition-all hover:bg-gray-300 dark:bg-stone-700 dark:hover:bg-stone-600"
          >
            <FileVideo2 className="h-5 w-5 text-gray-500 dark:text-gray-200" />
          </button>
        </div>
      </div>
      {showImageDropzone && (
        <div>
          <Label
            htmlFor="dropzone-file"
            className="dark:hover:bg-bray-800 flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-stone-600 dark:bg-stone-700 dark:hover:border-stone-500 dark:hover:bg-stone-600"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <p className="mb-1.5 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 10MB)
              </p>
            </div>

            <FileInput
              id="dropzone-file"
              sizing="sm"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size / 1024 / 1024 > 10) {
                    toast.error("File size too big (max 10MB)");
                  } else {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setFieldValue("medias", [
                        ...(medias?.length ? medias : []),
                        {
                          id: nanoid(),
                          type: "IMAGE",
                          image: e.target?.result as string,
                        },
                      ]);
                      setShowImageDropzone(false);
                    };
                    reader.readAsDataURL(file);
                  }
                }
              }}
            />
          </Label>
        </div>
      )}
      {showVideoInput && (
        <div className="flex">
          <input
            type="text"
            placeholder="Video embed URL eg. https://www.youtube.com/embed/..."
            className="w-full rounded-l-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-300 focus:outline-none focus:ring-0 dark:bg-stone-700"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button
            type="button"
            className="rounded-r-lg border-gray-300 bg-white px-5 py-2 text-sm placeholder-gray-300 focus:outline-none focus:ring-0 dark:bg-stone-700"
            onClick={addVideo}
          >
            Add
          </button>
        </div>
      )}
      <div className="flex w-full gap-3.5 overflow-x-scroll">
        {medias?.map((media) => (
          <div key={media.id} className="relative shrink-0">
            {media.type === "IMAGE" ? (
              <img
                src={media.url || media.image}
                className="h-32 w-32 rounded-lg object-cover"
                alt=""
                draggable
              />
            ) : (
              <iframe src={media.url} className="h-32 w-32 rounded-lg" />
            )}
            <button
              type="button"
              onClick={() => {
                setFieldValue(
                  "medias",
                  medias.filter((m) => m.id !== media.id),
                );
              }}
              className="absolute right-1.5 top-1.5 text-sm text-red-500 shadow transition-all hover:text-red-600"
            >
              <XCircleIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
