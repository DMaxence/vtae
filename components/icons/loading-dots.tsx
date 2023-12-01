import { cn } from "@/lib/utils";
import styles from "./loading-dots.module.css";

type LoadingDotsProps = {
  type?: "normal" | "error";
};

export default function LoadingDots({ type = "normal" }: LoadingDotsProps) {
  return (
    <span className={styles.loading}>
      <span
        // style={{ backgroundColor: color }}
        className={cn(
          type === "normal"
            ? "bg-black dark:bg-white"
            : "bg-red-500 dark:bg-red-300",
        )}
      />
      <span
        // style={{ backgroundColor: color }}
        className={cn(
          type === "normal"
            ? "bg-black dark:bg-white"
            : "bg-red-500 dark:bg-red-300",
        )}
      />
      <span
        // style={{ backgroundColor: color }}
        className={cn(
          type === "normal"
            ? "bg-black dark:bg-white"
            : "bg-red-500 dark:bg-red-300",
        )}
      />
    </span>
  );
}
