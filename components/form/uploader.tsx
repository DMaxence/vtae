"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Uploader({
  defaultValue,
  name,
  type,
}: {
  defaultValue: string | null;
  name: "image" | "logo" | "avatar";
  type: "avatar" | "file";
}) {
  const aspectRatio =
    name === "image" && type === "file" ? "aspect-video" : "aspect-square";

  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState({
    [name]: defaultValue,
  });

  const [dragActive, setDragActive] = useState(false);

  const handleUpload = (file: File | null) => {
    if (file) {
      if (file.size / 1024 / 1024 > 1) {
        toast.error("File size too big (max 1MB)");
      } else if (
        !file.type.includes("png") &&
        !file.type.includes("jpg") &&
        !file.type.includes("jpeg")
      ) {
        toast.error("Invalid file type (must be .png, .jpg, or .jpeg)");
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setData((prev) => ({ ...prev, [name]: e.target?.result as string }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const clearUpload = () => {
    setData((prev) => ({ ...prev, [name]: null }));
    inputRef.current!.value = "";
  };

  return (
    <div>
      <label
        htmlFor={`${name}-upload`}
        className={cn(
          "group relative mt-2 flex cursor-pointer flex-col items-center justify-center border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50",
          aspectRatio,
          type === "avatar" ? "rounded-full" : "rounded-md",
          {
            "max-w-screen-md": aspectRatio === "aspect-video",
            "max-w-xs": aspectRatio === "aspect-square",
            "max-w-[200px]": type === "avatar",
          },
        )}
      >
        <div
          className={cn(
            "absolute z-[5] h-full w-full",
            type === "avatar" ? "rounded-full" : "rounded-md",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            const file = e.dataTransfer.files && e.dataTransfer.files[0];
            inputRef.current!.files = e.dataTransfer.files; // set input file to dropped file
            handleUpload(file);
          }}
        />
        <div
          className={cn(
            `${
              dragActive ? "border-2 border-black" : ""
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center px-10 transition-all ${
              data[name]
                ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                : "bg-white opacity-100 hover:bg-gray-50"
            }`,
            type === "avatar" ? "rounded-full" : "rounded-md",
          )}
        >
          <svg
            className={`${
              dragActive ? "scale-110" : "scale-100"
            } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
            <path d="M12 12v9"></path>
            <path d="m16 16-4-4-4 4"></path>
          </svg>
          <p className="mt-2 text-center text-sm text-gray-500">
            Drag and drop or click to upload.
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Max file size: 1MB
          </p>
          <span className="sr-only">Photo upload</span>
        </div>
        {data[name] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data[name] as string}
            alt="Preview"
            className={cn(
              "h-full w-full object-cover",
              type === "avatar" ? "rounded-full" : "rounded-md",
            )}
          />
        )}
      </label>
      <div
        className={cn(
          "mt-1 flex shadow-sm",
          type === "avatar" ? "rounded-full" : "rounded-md",
        )}
      >
        <input
          id={`${name}-upload`}
          ref={inputRef}
          name={name}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.currentTarget.files && e.currentTarget.files[0];
            handleUpload(file);
          }}
        />
      </div>
      <div
        className={cn("mt-1 flex justify-center", {
          "max-w-screen-md": aspectRatio === "aspect-video",
          "max-w-xs": aspectRatio === "aspect-square",
          "max-w-[200px]": type === "avatar",
        })}
      >
        <button
          type="button"
          onClick={clearUpload}
          className={cn(
            "flex items-center justify-center space-x-2 rounded-md border px-5 py-1 text-sm transition-all focus:outline-none",
            "border-red-500 bg-red-100/75 text-red-600 hover:bg-red-200/75 hover:text-red-700 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
          )}
        >
          <p>Delete</p>
        </button>
      </div>
    </div>
  );
}
