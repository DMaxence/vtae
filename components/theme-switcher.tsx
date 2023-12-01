"use client";
import { Tooltip } from "flowbite-react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Tooltip
      content={`Toogle ${theme === "dark" ? "Light" : "Dark"} mode`}
      className="w-max"
    >
      <button
        // className="flex items-center gap-1 w-fit rounded-md bg-slate-200 p-2 duration-200 hover:scale-110 active:scale-100 dark:bg-[#212933]"
        className={`flex w-full items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
        {/* <span className="text-sm font-medium">
          {theme === "dark" ? "Light" : "Dark"}
        </span> */}
      </button>
    </Tooltip>
  );
};
