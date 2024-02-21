"use client";
import React from "react";
import styles from "./color-picker.module.scss";
// import { ChromePicker } from "react-color";
import { cn } from "@/lib/utils";
import GradientColorPicker, {
  useColorPicker,
} from "react-best-gradient-color-picker";

export default function ColorPicker() {
  const [open, setOpen] = React.useState(false);
  const [bgColor, setBgColor] = React.useState("#ffffff");
  const [color, setColor] = React.useState(
    "linear-gradient(90deg, rgba(96,93,93,1) 0%, rgba(255,255,255,1) 100%)",
  );
  // const { setSolid, setGradient } = useColorPicker(color, setColor);

  return (
    <div className="flex">
      <button
        type="button"
        className="flex items-center rounded-md border text-sm transition-all hover:bg-stone-100 focus:outline-none dark:border-stone-700 dark:hover:bg-stone-900"
        onClick={() => setOpen(!open)}
      >
        <div
          className="h-8 w-8 rounded-l-md bg-gray-300"
          style={{ backgroundColor: color }}
        />
        <span className="px-2.5 py-1.5">Background color</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 rounded-lg border border-stone-200 bg-stone-100 p-2.5 dark:border-stone-700 dark:bg-black">
            <GradientColorPicker
              hideOpacity
              hideEyeDrop
              hideAdvancedSliders
              hideColorGuide
              hideInputType
              hideGradientStop
              hidePresets
              value={color}
              onChange={setColor}
            />
          </div>
        </>
      )}
      {/* <div className="flex flex-col gap-2">
        <div className={cn(styles.pickerContainer, "flex rounded-md border")}>
          <label htmlFor="bgColor" className="px-2.5 py-1.5">
            <div className="text-sm font-bold">Background</div>
            <div className="text-xs">Color</div>
          </label>
          <input
            id="bgColor"
            type="color"
            name="bgColor"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </div>
        <div className="self-center">
          <button
            type="button"
            onClick={() => setBgColor("")}
            className="rounded-md border border-red-500 bg-red-100/75 px-2.5 py-1 text-xs text-red-600 hover:bg-red-200/75 hover:text-red-700 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
          >
            Reset
          </button>
        </div>
      </div> */}
    </div>
  );
}
