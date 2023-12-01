import { cn } from "@/lib/utils";
import LoadingDots from "./icons/loading-dots";

type DeleteButtonProps = {
  onDelete: () => void;
  loading: boolean;
};

export default function DeleteButton({ onDelete, loading }: DeleteButtonProps) {
  return (
    <button
      type="button"
      disabled={loading}
      className={cn(
        loading
          ? "cursor-not-allowed bg-red-100 dark:bg-red-600"
          : "text-red-400 hover:bg-blue-100 hover:text-red-500 dark:text-red-500 dark:hover:bg-red-800/75 dark:hover:text-red-400",
        "w-full rounded-lg px-4 py-2 text-sm transition-all duration-150 ease-in-out focus:outline-none focus:ring-0",
      )}
      onClick={onDelete}
    >
      {loading ? <LoadingDots type="error" /> : "DELETE"}
    </button>
  );
}
