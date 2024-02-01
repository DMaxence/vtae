"use client";

import { MaxWidthWrapper } from "@/components/home/max-width-wrapper";
import { PersonalInfos, Site, User } from "@prisma/client";
import { Link as LinkScroll } from "react-scroll";
import { navItems } from "./constants";

type FooterProps = {
  site: Site & {
    user: User;
    personalInfos: PersonalInfos;
  };
};

export default function Footer({ site }: FooterProps) {
  return (
    <footer className="flex w-full flex-col items-center justify-center gap-5 border-t border-white bg-[rgba(13,4,21,1)] py-7 print:hidden">
      <MaxWidthWrapper>
        <div className="grid h-14 grid-cols-2 items-center justify-center md:grid-cols-3">
          <div className="flex items-center">
            <div className="font-bold text-white">{site.user.name}</div>
          </div>
          <div className="flex items-center justify-self-center">
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
                className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-white transition-colors ease-out hover:text-white/75"
              >
                {name}
              </LinkScroll>
            ))}
          </div>
          <div className="justify-self-end text-xs uppercase text-white/75">
            &copy; {new Date().getFullYear()} {site.personalInfos.firstname}{" "}
            {site.personalInfos.lastname}
          </div>
        </div>
      </MaxWidthWrapper>
      <p className="text-center text-xs text-white/75">
        Powered by{" "}
        <a
          className="text-text-white font-semibold underline"
          href="https://vtae.xyz"
          rel="noreferrer noopener"
          target="_blank"
        >
          vtae.xyz
        </a>
      </p>
    </footer>
  );
}
