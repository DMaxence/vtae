import { Experience, Site } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { revalidateTag } from "next/cache";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const response = await fetch(input, { ...init, cache: "no-cache" });

  return response.json();
}

export const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const truncate = (str: string, num: number) => {
  if (!str) return "";
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

export const getBlurDataURL = async (url: string | null) => {
  if (!url) {
    return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  }
  try {
    const response = await fetch(
      `https://wsrv.nl/?url=${url}&w=50&h=50&blur=5`,
    );
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return `data:image/png;base64,${base64}`;
  } catch (error) {
    return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  }
};

export const placeholderBlurhash =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg==";

export const toDateString = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default function getScrollAnimation() {
  return {
    offscreen: {
      y: 150,
      opacity: 0,
    },
    onscreen: ({ duration = 2 } = {}) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration,
      },
    }),
  };
}

export const getTextDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

export const getElapsedTime = (
  startDate: Date | string,
  endDate: Date | string,
) => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const years = end.getFullYear() - start.getFullYear();
  const months =
    end.getMonth() -
    start.getMonth() +
    12 * (end.getFullYear() - start.getFullYear()) +
    1;

  const yearText =
    years === 0 || months < 12
      ? ""
      : years > 1
        ? `${years} years`
        : `${years} year`;

  let monthText = "";
  if (months <= 1) {
    monthText = " 1 month";
  } else if (months > 1 && months % 12 !== 0) {
    monthText = ` ${months % 12} months`;
  } else if (months % 12 === 0) {
    monthText = "";
  }

  return `${yearText}${monthText}`;
};

export const getExperienceYears = (experiences: Experience[]) => {
  const months = new Set();

  // convert date into unique integer month value based on year 1900
  function m1900(date: Date) {
    const y = date.getFullYear();
    const m = date.getMonth();
    return (y - 1900) * 12 + m;
  }

  experiences?.forEach((job) => {
    const m1 = m1900(new Date(job.startDate));
    const m2 = m1900(job?.endDate ? new Date(job.endDate) : new Date());
    for (let m = m1; m < m2; m++) months.add(m);
  });
  const experienceYears = Math.round((months.size / 12) * 2) / 2;
  return experienceYears;
};

export const isValidEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const getClickableLink = (link: string) => {
  if (isValidEmail(link)) return `mailto:${link}`;

  return link.startsWith("http://") || link.startsWith("https://")
    ? link
    : `https://${link}`;
};

export const revalidateSite = async (site: Site) => {
  await revalidateTag(
    `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
  );
  site.customDomain && (await revalidateTag(`${site.customDomain}-metadata`));
};

export const websiteScreenshotImage = (site: Site) => {
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/vtae/website-screenshots/${site.subdomain}.png`;
};

export const takeWebsiteScreenshot = async (site: Site) => {
  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    : `http://${site.subdomain}.localhost:${process.env.PORT || 3000}`;
  fetch("/api/images", {
    method: "POST",
    body: JSON.stringify({
      url,
      siteId: site.id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
