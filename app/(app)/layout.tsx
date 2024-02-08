import "@/styles/globals.scss";
import "flowbite";
import { cal, inter, satoshi } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

const title = "Vtae - Build your portfolio and host it in minutes.";
const description =
  "Vtae is a wonderful SaaS portfolio builder that allows you to create your portfolio in minutes and host it for free.";
const image = "https://vtae.xyz/thumbnail.png";

export const metadata: Metadata = {
  title,
  description,
  icons: ["https://vtae.xyz/favicon.ico"],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: "@maxencedhx_dev",
  },
  metadataBase: new URL("https://vtae.xyz"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(cal.variable, inter.variable, satoshi.variable)}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
