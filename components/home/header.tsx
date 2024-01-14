import { Nav as NavDesktop } from "./nav";
import { NavMobile } from "./nav-mobile";

export default function Header() {
  return (
    <>
      <NavMobile />
      <NavDesktop />
    </>
  );

  // return (
  //   <div
  //     className={cn("sticky inset-x-0 top-0 z-30 w-full transition-all", {
  //       "border-b border-gray-200 bg-white/75 backdrop-blur-lg dark:border-gray-700 dark:bg-white/10":
  //         scrollActive,
  //     })}
  //   >
  //     <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-20">
  //       <div className="flex h-14 items-center justify-between">
  //         <div className="flex items-center space-x-4">
  //           <Link href="/" className="py-3.5">
  //             <Image
  //               alt="Vtae"
  //               className="relative mx-auto object-contain dark:invert"
  //               width={80}
  //               height={30}
  //               src="/logo.png"
  //             />
  //           </Link>
  //           <nav
  //             aria-label="Main"
  //             data-orientation="horizontal"
  //             dir="ltr"
  //             className="relative hidden lg:block"
  //           >
  //             <div style={{ position: "relative" }}>
  //               <ul
  //                 data-orientation="horizontal"
  //                 className="flex flex-row space-x-2 p-4"
  //                 dir="ltr"
  //               >
  //                 <li>
  //                   <button
  //                     id="radix-:R4l5a:-trigger-radix-:R2sl5a:"
  //                     data-state="closed"
  //                     aria-expanded="false"
  //                     aria-controls="radix-:R4l5a:-content-radix-:R2sl5a:"
  //                     className="group flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none dark:hover:bg-stone-800"
  //                     data-radix-collection-item=""
  //                   >
  //                     <p className="text-sm font-medium text-gray-500 transition-colors ease-out group-hover:text-black dark:text-gray-300 dark:group-hover:text-white">
  //                       Features
  //                     </p>
  //                     <svg
  //                       xmlns="http://www.w3.org/2000/svg"
  //                       width="24"
  //                       height="24"
  //                       viewBox="0 0 24 24"
  //                       fill="none"
  //                       stroke="currentColor"
  //                       strokeWidth="2"
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                       className="h-4 w-4 transition-all group-data-[state=open]:rotate-180"
  //                     >
  //                       <path d="m6 9 6 6 6-6"></path>
  //                     </svg>
  //                   </button>
  //                 </li>
  //                 <a
  //                   id="nav-customers"
  //                   className={cn(buttonClassname, textColorClassname)}
  //                   href="/customers"
  //                 >
  //                   Customers
  //                 </a>
  //                 <a
  //                   id="nav-changelog"
  //                   className={cn(buttonClassname, textColorClassname)}
  //                   href="/changelog"
  //                 >
  //                   Changelog
  //                 </a>
  //                 <a
  //                   id="nav-help"
  //                   className={cn(buttonClassname, textColorClassname)}
  //                   href="/help"
  //                 >
  //                   Help
  //                 </a>
  //                 <a
  //                   id="nav-pricing"
  //                   className={cn(buttonClassname, textColorClassname)}
  //                   href="/pricing"
  //                 >
  //                   Pricing
  //                 </a>
  //               </ul>
  //             </div>
  //           </nav>
  //         </div>
  //         <div className="hidden lg:flex lg:items-center lg:justify-between">
  //           <div>
  //             <ThemeSwitcher tooltip={false} />
  //           </div>
  //           <Link
  //             className={cn(
  //               "animate-fade-in rounded-full px-4 py-1.5 text-sm font-medium transition-colors ease-out",
  //               textColorClassname,
  //             )}
  //             href={`${APP_DOMAIN}/login`}
  //           >
  //             Log in
  //           </Link>
  //           <Link
  //             className="animate-fade-in rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
  //             href={`${APP_DOMAIN}/register`}
  //           >
  //             Sign Up
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
