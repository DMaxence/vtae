"use client";

import React from "react";

import * as yup from "yup";

import type { PersonalInfos } from "@prisma/client";

import CancelButton from "@/components/cancel-button";
import ModalTitle from "@/components/modal-title";
import SubmitButton from "@/components/submit-button";
import TextInput from "@/components/text-input";
import useSWR from "swr";

import { WithSiteId } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";

import { useModal } from "@/components/modal/provider";
import { currentInfosFields } from "@/constants/fields";

interface CurrentInfosModalProps extends WithSiteId {}

const CurrentInfosModal = ({ siteId }: CurrentInfosModalProps) => {
  const modal = useModal();
  const [isPending, startTransition] = React.useTransition();

  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const { data: personalInfos } = useSWR<PersonalInfos>(
    sessionId && `/api/builder/${siteId}/personal-infos`,
    fetcher,
  );

  const validationSchema = yup.object({
    location: yup.string().trim(),
    currentWork: yup.string().trim(),
  });

  async function onSubmit({ location, currentWork }: PersonalInfos) {
    // const res = await fetch("/api/personal-infos", {
    //   method: HttpMethod.POST,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     location: location,
    //     currentWork: currentWork,
    //   }),
    // });
    // if (res.ok) {
    //   const data = await res.json();
    //   // push data on redux store
    //   mutate("/api/personal-infos");
    //   toast.success("Current infos updated");
    //   setShowModal(false);
    //   setUpdatingInfos(false);
    // }
  }

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={currentInfosFields.reduce((acc, field) => {
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
        <ModalTitle title="Edit your current informations" />
        <div className="mx-auto grid w-5/6 gap-y-5">
          {currentInfosFields.map((field) => (
            <TextInput key={field.name} {...field} />
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
};

export default CurrentInfosModal;
