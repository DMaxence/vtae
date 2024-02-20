import FeaturesAcordion from "@/components/home/features-acordion";
import Roadmap from "@/components/home/roadmap";
import { APP_DOMAIN } from "@/utils";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <div className="mx-auto mb-10 mt-12 max-w-md px-2.5 text-center sm:max-w-lg sm:px-0">
        <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.15] sm:text-6xl sm:leading-[1.15]">
          Your online portfolio with
          <br />
          <span className="bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 bg-clip-text text-transparent">
            Superpowers
          </span>
        </h1>
        <h2 className="mt-5 text-gray-600 sm:text-xl">
          Vtae.xyz is the easiest way to create your online portfolio.
        </h2>
        <div className="mx-auto mt-5 flex max-w-fit space-x-4">
          <Link
            href={`${APP_DOMAIN}/register`}
            className="rounded-full border border-black bg-black px-5 py-2 text-sm text-white shadow-lg transition-all hover:bg-white hover:text-black"
          >
            Start for Free
          </Link>
          {/* <a
            className="rounded-full border border-gray-300 bg-white px-5 py-2 text-black shadow-lg transition-all hover:border-gray-800"
            href="/enterprise"
          >
            <p className="text-sm">Get a Demo</p>
          </a> */}
        </div>
      </div>
      <div className="mx-auto w-full max-w-4xl px-2.5 sm:px-0">
        <Image
          width={1200}
          height={800}
          className="block dark:hidden"
          src="/screenshot-demo.png"
          alt="Screenshot of the platform"
        />
        <Image
          width={1200}
          height={800}
          className="hidden dark:block"
          src="/screenshot-demo-dark.png"
          alt="Screenshot of the platform"
        />
      </div>
      <div id="features">
        <div className="mx-auto w-full max-w-screen-xl px-2.5 pb-10 pt-24 lg:px-20">
          <div className="mx-auto max-w-md text-center sm:max-w-2xl">
            <h2 className="font-display text-4xl font-extrabold leading-tight text-black dark:text-white sm:text-5xl sm:leading-tight">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Boost
              </span>{" "}
              your portofio to stand{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Out
              </span>{" "}
              of the crowd
            </h2>
            <p className="mt-5 text-gray-600 dark:text-slate-400 sm:text-lg"></p>
          </div>
          <FeaturesAcordion />
        </div>
      </div>
      {/* <Pricing /> */}
      <Roadmap />
      <div className="mt-20 border-t border-gray-200 bg-white/10 py-20 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur dark:border-slate-700 dark:bg-black/10 dark:shadow-[inset_10px_-50px_94px_0_rgb(50,50,50,0.2)]">
        <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-20">
          <div className="mx-auto max-w-md text-center sm:max-w-xl">
            <h2 className="bg-gradient-to-r from-blue-400 via-blue-700 to-blue-400 bg-clip-text font-display text-4xl font-extrabold leading-tight text-transparent sm:text-5xl sm:leading-tight">
              Ready to Get Started?
            </h2>
            <p className="mt-5 text-gray-600 dark:text-slate-400 sm:text-lg">
              Setting up your first portfolio only takes a few minutes.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <Link
              href={`${APP_DOMAIN}/register`}
              className="rounded-full border border-black bg-black px-5 py-2 text-sm text-white shadow-lg transition-all hover:bg-white hover:text-black dark:border-blue-700 dark:bg-blue-700 dark:hover:bg-black dark:hover:text-white"
            >
              Start for Free
            </Link>
            <p className="text-gray-600 dark:text-slate-400">
              No credit card required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
