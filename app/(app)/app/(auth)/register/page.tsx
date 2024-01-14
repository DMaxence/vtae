"use client";

import LoadingDots from "@/components/icons/loading-dots";
import TextInput from "@/components/text-input";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Providers } from "@/lib/types";
import { getLang } from "@/lib/utils";
import { APP_DOMAIN } from "@/utils/constants";
import { Form, Formik } from "formik";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Suspense } from "react";
import * as yup from "yup";
import LoginButton from "@/components/login-button";

const MINIMUM_ACTIVITY_TIMEOUT = 1000;

const emailInput = {
  id: "email",
  name: "email",
  type: "email",
  autoComplete: "email",
  placeholder: "Email address",
};
const passwordInput = {
  id: "password",
  name: "password",
  type: "password",
  autoComplete: "current-password",
  placeholder: "Password",
};
const firstnameInput = {
  id: "firstname",
  name: "firstname",
  type: "text",
  autoComplete: "given-name",
  placeholder: "First name",
};
const lastnameInput = {
  id: "lastname",
  name: "lastname",
  type: "text",
  autoComplete: "family-name",
  placeholder: "Last name",
};

export default function LoginPage({ searchParams }: any) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const validationSchema = yup.object({
    firstname: yup.string().max(32, "First name must be 32 characters or less"),
    lastname: yup.string().max(32, "Last name must be 32 characters or less"),
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  return (
    <div>
      <div className="absolute right-0 top-0 p-4">
        <ThemeSwitcher />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="relative mx-auto h-12 w-auto">
          <Link
            href={
              process.env.NEXT_PUBLIC_VERCEL_ENV
                ? `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
                : `http://localhost:3000`
            }
          >
            <Image
              alt="Vtae"
              className="relative mx-auto h-12 w-auto object-contain dark:invert"
              width={100}
              height={100}
              src="/logo.png"
            />
          </Link>
        </div>
        <h1 className="mt-6 text-center font-cal text-3xl font-extrabold dark:text-white">
          Your online resume
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Build and host your resume with custom domains.
        </p>
      </div>
      <div className="mx-5 mt-8 border border-stone-200 bg-white/50 py-10 dark:border-stone-700 dark:bg-black/50 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              email: "",
              password: "",
              firstname: "",
              lastname: "",
            }}
            onSubmit={async (values: any, actions) => {
              console.log("values", values);
              setLoading(true);
              try {
                const res = await signIn("app-register", {
                  callbackUrl: "/",
                  email: values.email,
                  password: values.password,
                  firstname: values.firstname,
                  lastname: values.lastname,
                  locale: getLang(),
                  redirect: false,
                });
                if (res) setLoading(false);
                if (res?.error) {
                  setError(res.error);
                } else if (res?.ok) {
                  router.refresh();
                }

                setTimeout(() => {
                  setLoading(false);
                }, MINIMUM_ACTIVITY_TIMEOUT);
              } catch (error) {
                console.error(error);
                setLoading(false);
              }
              actions.setSubmitting(false);
            }}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {({ handleSubmit }) => (
              <Form className="mx-auto mt-4 w-11/12 max-w-xs pb-5 sm:w-full">
                {[firstnameInput, lastnameInput, emailInput, passwordInput].map(
                  (input) => (
                    <div key={input.id} className="">
                      <label
                        htmlFor={input.id}
                        className="block text-sm font-medium text-neutral-400"
                      >
                        {input.placeholder}
                      </label>
                      <div className="mt-1">
                        <TextInput {...input} />
                      </div>
                    </div>
                  ),
                )}
                {error && (
                  <div className="mt-1 text-sm text-red-400">{error}</div>
                )}

                <div className="mt-6 flex justify-center space-y-2">
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={() => handleSubmit()}
                    className="rounded-lg border border-black bg-black px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800"
                  >
                    {loading ? (
                      <div className="invert">
                        <LoadingDots />
                      </div>
                    ) : (
                      <p>Register</p>
                    )}
                  </button>
                </div>
                <div className="mt-6 flex justify-center space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <p className="text-sm font-medium text-neutral-400">
                      Already have an account?
                    </p>
                    <Link
                      href={`${APP_DOMAIN}/login`}
                      className="text-sm font-medium text-black hover:text-stone-500 dark:text-white"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Suspense>

        <div className="subtitle">Or</div>
        <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
          <Suspense
            fallback={
              <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
            }
          >
            <LoginButton provider={Providers.github} />
            <LoginButton provider={Providers.linkedIn} />
            <LoginButton provider={Providers.google} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
