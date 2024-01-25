import { cn } from "@/lib/utils";
import styles from "./loading-dots.module.css";

type LoadingDotsProps = {
  type?: "normal" | "error" | "gray" | "light-gray";
};

export default function LoadingDots({ type = "normal" }: LoadingDotsProps) {
  return (
    <span className={styles.loading}>
      <span
        // style={{ backgroundColor: color }}
        className={cn({
          "bg-black dark:bg-white": type === "normal",
          "bg-red-500 dark:bg-red-300": type === "error",
          "bg-gray-500 dark:bg-gray-300": type === "gray",
          "bg-gray-400 dark:bg-gray-200": type === "light-gray",
        })}
      />
      <span
        // style={{ backgroundColor: color }}
        className={cn({
          "bg-black dark:bg-white": type === "normal",
          "bg-red-500 dark:bg-red-300": type === "error",
          "bg-gray-500 dark:bg-gray-300": type === "gray",
          "bg-gray-400 dark:bg-gray-200": type === "light-gray",
        })}
      />
      <span
        // style={{ backgroundColor: color }}
        className={cn({
          "bg-black dark:bg-white": type === "normal",
          "bg-red-500 dark:bg-red-300": type === "error",
          "bg-gray-500 dark:bg-gray-300": type === "gray",
          "bg-gray-400 dark:bg-gray-200": type === "light-gray",
        })}
      />
    </span>
  );
}
