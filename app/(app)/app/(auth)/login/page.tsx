import Image from "next/image";
import LoginButton from "./login-button";
import { Suspense } from "react";
import { Providers } from "@/lib/types";

export default function LoginPage() {
  return (
    <div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="relative mx-auto h-12 w-auto">
          <Image
            alt="Vtae"
            className="relative mx-auto h-12 w-auto object-contain dark:invert"
            width={100}
            height={100}
            src="/logo.png"
          />
        </div>
        <h1 className="mt-6 text-center font-cal text-3xl font-extrabold dark:text-white">
          Your online resume
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Build and host your resume with custom domains.
        </p>
      </div>
      <div className="mx-5 mt-8 border border-stone-200 py-10 dark:border-stone-700 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md">
        <h2 className="text-center">
          Sign in with an existing account, or create new account.
        </h2>
        <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
          <Suspense
            fallback={
              <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
            }
          >
            {/* <GithubLoginButton />
            <LinkedinLoginButton /> */}
            <LoginButton provider={Providers.github} />
            <LoginButton provider={Providers.linkedIn} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
