"use client";

import React from "react";

import * as yup from "yup";

import type { PersonalInfos } from "@prisma/client";

import { Form, Formik } from "formik";

import CancelButton from "@/components/cancel-button";
import ModalTitle from "@/components/modal-title";
import SubmitButton from "@/components/submit-button";
import useSWR from "swr";

import { useModal } from "@/components/modal/provider";
import { fetcher } from "@/lib/utils";
import { useSession } from "next-auth/react";

import { aboutFields } from "@/constants/fields";

import TextArea from "@/components/textarea";
import { WithSiteId } from "@/lib/types";

interface AboutModalProps extends WithSiteId {}

export default function AboutModal({ siteId }: AboutModalProps) {
  const modal = useModal();
  const [isPending, startTransition] = React.useTransition();

  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const { data: personalInfos } = useSWR<PersonalInfos>(
    sessionId && `/api/builder/${siteId}/personal-infos`,
    fetcher,
  );

  const validationSchema = yup.object({
    about: yup
      .string()
      .trim()
      .max(aboutFields[0].maxLength || 1000, "Text is too long"),
  });

  async function onSubmit({ about }: PersonalInfos) {
    startTransition(async () => {});
    // const res = await fetch("/api/personal-infos", {
    //   method: HttpMethod.POST,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     about: about,
    //   }),
    // });
    // if (res.ok) {
    //   const data = await res.json();
    //   // push data on redux store
    //   mutate("/api/personal-infos");
    //   toast.success("Bio updated");
    //   setShowModal(false);
    //   setUpdatingInfos(false);
    // }
  }

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={aboutFields.reduce((acc, field) => {
        acc[field.name] = personalInfos?.[field.name] ?? "";
        return acc;
      }, {})}
      onSubmit={(values, actions) => {
        onSubmit(values as PersonalInfos);
        actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Form className="inline-block w-full max-w-md overflow-hidden rounded-lg border border-stone-200 bg-white pt-8 text-center align-middle shadow-md transition-all dark:border-stone-700 dark:bg-stone-900">
        <ModalTitle title="Edit your bio" />
        <div className="mx-auto grid w-5/6 gap-y-5">
          {aboutFields.map((field) => (
            <TextArea key={field.name} {...field} />
          ))}
        </div>
        <div className="mb-5 mt-3 flex w-full flex-row-reverse items-center justify-between px-8">
          <div className="flex gap-3.5 self-start">
            <CancelButton onCancel={() => modal?.hide()} />
            <SubmitButton loading={isPending} />
          </div>
        </div>
      </Form>
    </Formik>
  );
}
