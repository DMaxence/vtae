"use client";
import React from "react";
import styles from "./color-picker.module.scss";
// import { ChromePicker } from "react-color";
import { cn } from "@/lib/utils";
// import ColorPicker, { useColorPicker } from "react-best-gradient-color-picker";

export default function ColorPicker() {
  const [open, setOpen] = React.useState(false);
  const [bgColor, setBgColor] = React.useState("#ffffff");
  // const [color, setColor] = React.useState(
  //   "linear-gradient(90deg, rgba(96,93,93,1) 0%, rgba(255,255,255,1) 100%)",
  // );
  // const { setSolid, setGradient } = useColorPicker(color, setColor);
  // console.log("color", color);

  return (
    <div className="flex">
      {/* <button
        type="button"
        className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm transition-all hover:bg-stone-100 focus:outline-none dark:border-stone-700 dark:hover:bg-stone-900"
        onClick={() => setOpen(!open)}
      >
        <div
          className="h-4 w-4 bg-gray-300"
          style={{ backgroundColor: color }}
        />
        Background color
      </button>
      {open && (
        <>

          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ChromePicker
            className="absolute z-20"
            color={color}
            onChange={(color) => setColor(color.hex)}
          />
        </>
      )} */}
      <div className="flex flex-col gap-2">
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
            onChange={(e) => {
              console.log(e.target.value);
              setBgColor(e.target.value);
            }}
          />
        </div>
        <div className="self-center">
          <button
            type="button"
            onClick={() => setBgColor("")}
            className="rounded-md border text-xs border-red-500 bg-red-100/75 px-2.5 py-1 text-red-600 hover:bg-red-200/75 hover:text-red-700 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
