"use client";
import { Link as LinkScroll, animateScroll as scroll } from "react-scroll";

import { MaxWidthWrapper } from "@/components/home/max-width-wrapper";
import useScroll from "@/lib/hooks/use-scroll";
import { Site, User } from "@prisma/client";
import { ArrowUp } from "lucide-react";
import { navItems } from "./constants";

type HeaderProps = {
  site: Site & {
    user: User;
  };
};

export function Header({ site }: HeaderProps) {
  const scrolled = useScroll(80);

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 500,
      smooth: true,
    });
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-30 w-full border-b border-gray-200/50 bg-white/10 backdrop-blur-lg transition-all dark:border-gray-700 dark:bg-white/10">
        <MaxWidthWrapper>
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center">
              <div className="font-bold text-white">{site.user.name}</div>
            </div>
            <div className="flex items-center">
              {navItems.map(({ name, slug }) => (
                <LinkScroll
                  activeClass="active"
                  spy={true}
                  smooth={true}
                  duration={400}
                  offset={-50}
                  id={`nav-${slug}`}
                  key={slug}
                  to={`${slug}`}
                  className="cursor-pointer px-3 py-2 text-sm font-medium text-white transition-colors ease-out hover:text-white/75"
                >
                  {name}
                </LinkScroll>
              ))}
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
      {scrolled && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white p-2 transition-colors ease-out hover:bg-white/20"
        >
          <ArrowUp className="h-6 w-6 text-white" />
        </button>
      )}
    </>
  );
}
