"use client";
import { Tooltip } from "flowbite-react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ThemeSwitcherProps = {
  tooltip?: boolean;
};

const ThemeSwitcherButton = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      className={`flex w-full items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
      {/* <span className="text-sm font-medium">
          {theme === "dark" ? "Light" : "Dark"}
        </span> */}
    </button>
  );
};

export const ThemeSwitcher = ({ tooltip }: ThemeSwitcherProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return tooltip ? (
    <Tooltip
      content={`Toogle ${theme === "dark" ? "Light" : "Dark"} mode`}
      className="w-max"
    >
      <ThemeSwitcherButton />
    </Tooltip>
  ) : (
    <ThemeSwitcherButton />
  );
};
