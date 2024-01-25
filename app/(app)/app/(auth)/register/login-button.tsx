"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { Providers } from "@/lib/types";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import GithubSVG from "@/public/icons/github.svg";
import LinkedinSVG from "@/public/icons/linkedin.svg";
import GoogleSVG from "@/public/icons/google.svg";

type LoginButtonProps = {
  provider: Providers;
};

export default function LoginButton({ provider }: LoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const providerName =
    provider === Providers.github
      ? "github"
      : provider === Providers.linkedIn
        ? "linkedin"
        : "google";

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  }, [error]);

  return (
    <button
      disabled={loading}
      onClick={() => {
        console.log(
          "will attempt to sign in",
          Object.keys(Providers)[Object.values(Providers).indexOf(provider)],
        );
        setLoading(true);
        signIn(providerName);
      }}
      className={`${
        loading
          ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
          : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
      } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
    >
      {loading ? (
        <LoadingDots type="light-gray" />
      ) : (
        <>
          {provider === Providers.github && (
            <GithubSVG className="h-4 w-4 text-black dark:text-white" />
          )}
          {provider === Providers.linkedIn && (
            <LinkedinSVG className="h-4 w-4" />
          )}
          {provider === Providers.google && <GoogleSVG className="h-4 w-4" />}

          <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
            Continue with {provider}
          </p>
        </>
      )}
    </button>
  );
}
