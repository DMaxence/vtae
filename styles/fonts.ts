import localFont from "next/font/local";
import { Inter, Lora, Work_Sans, Montserrat } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const cal = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-cal",
  weight: "600",
  display: "swap",
});

export const calTitle = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-title",
  weight: "600",
  display: "swap",
});

export const satoshi = localFont({
  src: "./Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
  style: "normal",
});

export const lora = Lora({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

export const work = Work_Sans({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});
export const montserratTitle = Montserrat({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

export const fontMapper = {
  "font-cal": calTitle.variable,
  "font-lora": lora.variable,
  "font-work": work.variable,
  "font-satoshi": satoshi.variable,
  "font-montserrat": montserrat.variable,
} as Record<string, string>;
