"use client";
import React from "react";

import { cn } from "@/lib/utils";
import { APP_DOMAIN } from "@/utils";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { FEATURES_LIST } from "./content";

export default function FeaturesAcordion() {
  const { theme } = useTheme();
  const _changingContentRef = React.useRef(null);
  const [activeItem, setActiveItem] = React.useState(FEATURES_LIST[0]);
  const [transitionEnter, setTransitionEnter] = React.useState(false);
  const [transitionLeave, setTransitionLeave] = React.useState(false);

  const changeItem = (item: string) => {
    // if (_changingContentRef.current) {
    //   setTransitionLeave(true);
    //   // @ts-ignore
    //   _changingContentRef.current.style.transform = "translateY(-10px)";
    //   // @ts-ignore
    //   _changingContentRef.current.style.opacity = "0.5";
    //   setTimeout(() => {
    //     // @ts-ignore
    //     _changingContentRef.current.style.opacity = "0";
    //     // @ts-ignore
    //     _changingContentRef.current.style.transform = "translateY(10px)";
    //     setTransitionLeave(false);
    //     setTransitionEnter(true);
    //   }, 150);
    //   setTimeout(() => {
    //     // @ts-ignore
    //     _changingContentRef.current.style.transform = "translateY(0px)";
    //     // @ts-ignore
    //     _changingContentRef.current.style.opacity = "1";
    setActiveItem(FEATURES_LIST[parseInt(item.split("-")[1]) - 1]);
    //   setTransitionEnter(false);
    // }, 300);
    // }
  };

  // React.useEffect(() => {
  //   if (_changingContentRef.current) {
  //     _changingContentRef.current.style.height = `${
  //       _changingContentRef.current.scrollHeight
  //     }px`;
  //   }
  // }, []
  // );

  return (
    <div className="my-10 h-[840px] w-full overflow-hidden rounded-xl border border-gray-200 bg-white/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur dark:border-slate-700 dark:bg-black/10 dark:shadow-[inset_10px_-50px_94px_0_rgb(50,50,50,0.2)] lg:h-[630px]">
      <div className="grid grid-cols-1 gap-10 p-5 lg:grid-cols-3">
        <Accordion.Root
          type="single"
          defaultValue="item-1"
          onValueChange={changeItem}
        >
          {FEATURES_LIST.map(({ title, content, icon: Icon }, index) => (
            <Accordion.Item
              key={index}
              value={`item-${index + 1}`}
              className="border-b border-b-slate-200 py-3 last:border-none dark:border-b-slate-700"
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="flex flex-1 items-center justify-between font-medium transition-all sm:text-lg [&[data-state=open]>svg]:rotate-180">
                  <div className="flex items-center space-x-3 p-3">
                    <Icon className="h-5 w-5 text-gray-600 dark:text-slate-100" />
                    <h3 className="text-base font-semibold text-gray-600 dark:text-slate-100">
                      {title}
                    </h3>
                  </div>
                  <ChevronDownIcon
                    aria-hidden
                    className="h-5 w-5 transition-transform duration-300 dark:text-gray-300"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden text-sm text-gray-500 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down dark:text-gray-400 sm:text-base">
                <div className="p-3">
                  <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
                    {content}
                  </p>
                  <Link
                    href={`${APP_DOMAIN}/register`}
                    className="block max-w-fit rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
                  >
                    Start for free
                  </Link>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
        <div className="shadow-2xl lg:col-span-2 lg:mt-10">
          <div
            ref={_changingContentRef}
            className="relative aspect-[1735/990] min-h-[600px] w-full overflow-hidden whitespace-nowrap rounded-2xl dark:bg-slate-900  lg:w-[800px]"
          >
            <Image
              alt={activeItem.title}
              src={activeItem.image}
              loading="lazy"
              width="800"
              height="600"
              decoding="async"
              data-nimg="1"
              className={cn(
                "block aspect-[800/600] object-cover object-left-top dark:hidden",
                // {
                //   "blur-0": !transitionEnter && !transitionLeave,
                //   blur: transitionEnter,
                // },
              )}
            />
            <Image
              alt={activeItem.title}
              src={activeItem.imageDark}
              loading="lazy"
              width="800"
              height="600"
              decoding="async"
              data-nimg="1"
              className={cn(
                "hidden aspect-[800/600] object-cover object-left-top dark:block",
                // {
                //   "blur-0": !transitionEnter && !transitionLeave,
                //   blur: transitionEnter,
                // },
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
