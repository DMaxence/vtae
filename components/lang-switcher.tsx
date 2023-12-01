import { Tooltip } from "flowbite-react";
import { Languages } from "lucide-react";

export const LangSwitcher = () => {
  return (
    <Tooltip content={`Only english available`} className="w-max">
      <button
        disabled
        className={`flex w-full cursor-not-allowed items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
      >
        <Languages size={18} />
        <span className="text-sm font-medium">English</span>
      </button>
    </Tooltip>
  );
};
