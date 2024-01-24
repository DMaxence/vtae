"use client";

import { cn, fetcher } from "@/lib/utils";
import useScroll from "@/lib/hooks/use-scroll";
import { APP_DOMAIN } from "@/utils";
import va from "@vercel/analytics";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import useSWR from "swr";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { ThemeSwitcher } from "../theme-switcher";

export const navItems = [];

export function Nav() {
  const { domain = "vtae.xyz" } = useParams() as { domain: string };
  const scrolled = useScroll(80);
  const selectedLayout = useSelectedLayoutSegment();
  const helpCenter = selectedLayout === "help";
  const { data: session, isLoading } = useSWR(
    domain === "vtae.xyz" && "/api/auth/session",
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return (
    <div
      className={cn(`sticky inset-x-0 top-0 z-30 w-full transition-all`, {
        "border-b border-gray-200 bg-white/75 backdrop-blur-lg dark:border-gray-700 dark:bg-white/10":
          scrolled,
      })}
    >
      <MaxWidthWrapper
        {...(helpCenter && {
          className: "max-w-screen-lg",
        })}
      >
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={domain === "vtae.xyz" ? "/" : `https://vtae.xyz`}
              {...(domain !== "vtae.xyz" && {
                onClick: () => {
                  va.track("Referred from custom domain", {
                    domain,
                    medium: "logo",
                  });
                },
              })}
            >
              <Image
                alt="Vtae"
                className="relative mx-auto object-contain dark:invert"
                width={80}
                height={30}
                src="/logo.png"
              />
            </Link>
            {navItems.map(({ name, slug }) => (
              <Link
                id={`nav-${slug}`}
                key={slug}
                href={
                  domain === "vtae.xyz"
                    ? `/${slug}`
                    : `https://vtae.xyz/${slug}`
                }
                {...(domain !== "vtae.xyz" && {
                  onClick: () => {
                    va.track("Referred from custom domain", {
                      domain,
                      medium: `navbar item (${slug})`,
                    });
                  },
                })}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors ease-out hover:text-black",
                  {
                    "text-black": selectedLayout === slug,
                  },
                )}
              >
                {name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:justify-between">
            <div>
              <ThemeSwitcher tooltip={false} />
            </div>
            {session && Object.keys(session).length > 0 ? (
              <Link
                href={APP_DOMAIN}
                className="animate-fade-in rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
              >
                Dashboard
              </Link>
            ) : !isLoading ? (
              <>
                <Link
                  href={`${APP_DOMAIN}/login`}
                  {...(domain !== "vtae.xyz" && {
                    onClick: () => {
                      va.track("Referred from custom domain", {
                        domain,
                        medium: `navbar item (login)`,
                      });
                    },
                  })}
                  className="animate-fade-in rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors ease-out hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href={`${APP_DOMAIN}/register`}
                  {...(domain !== "vtae.xyz" && {
                    onClick: () => {
                      va.track("Referred from custom domain", {
                        domain,
                        medium: `navbar item (signup)`,
                      });
                    },
                  })}
                  className="animate-fade-in rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
                >
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
