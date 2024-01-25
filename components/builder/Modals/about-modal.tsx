"use client";

import React from "react";

import * as yup from "yup";

import type { PersonalInfos } from "@prisma/client";

import { Form, Formik } from "formik";

import CancelButton from "@/components/cancel-button";
import ModalTitle from "@/components/modal-title";
import SubmitButton from "@/components/submit-button";
import useSWR, { mutate } from "swr";

import { fetcher } from "@/lib/utils";
import { useSession } from "next-auth/react";

import { aboutFields } from "@/constants/fields";

import Modal from "@/components/modal";
import TextArea from "@/components/textarea";
import { createOrUpdatePersonalInfos } from "@/lib/builder/personal-infos";
import { InitialValuesType, WithShowModal, WithSiteId } from "@/lib/types";
import { toast } from "sonner";

interface AboutModalProps extends WithSiteId, WithShowModal {}

export default function AboutModal({
  showModal,
  setShowModal,
  siteId,
}: AboutModalProps) {
  const [isPending, startTransition] = React.useTransition();

  const { status } = useSession();

  const { data: personalInfos } = useSWR<PersonalInfos>(
    status === "authenticated" && `/api/builder/${siteId}/personal-infos`,
    fetcher,
  );

  const validationSchema = yup.object({
    about: yup
      .string()
      .trim()
      .max(aboutFields[0].maxLength || 1000, "Text is too long"),
  });

  const close = () => setShowModal(false);

  const onSubmit = async (data: PersonalInfos) =>
    startTransition(async () => {
      const res = await createOrUpdatePersonalInfos(data, siteId);
      if (res.error) {
        toast.error(res.error);
      } else {
        mutate(`/api/builder/${siteId}/personal-infos`);
        close();
        toast.success(`Successfully updated personal infos!`);
      }
    });

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={aboutFields.reduce((acc: InitialValuesType, field) => {
        acc[field.name] =
          personalInfos?.[field.name as keyof typeof personalInfos] ?? "";
        return acc;
      }, {})}
      onSubmit={(values, actions) => {
        onSubmit(values as PersonalInfos);
        actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <Form className="inline-block w-full max-w-2xl overflow-hidden rounded-lg border border-stone-200 bg-white pt-8 text-center align-middle shadow-md transition-all dark:border-stone-700 dark:bg-stone-900">
          <ModalTitle title="Edit your bio" />
          <div className="mx-auto grid w-5/6 gap-y-5">
            {aboutFields.map((field) => (
              <TextArea key={field.name} {...field} />
            ))}
          </div>
          <div className="mb-5 mt-3 flex w-full flex-row-reverse items-center justify-between px-8">
            <div className="flex gap-3.5 self-start">
              <CancelButton onCancel={close} />
              <SubmitButton loading={isPending} />
            </div>
          </div>
        </Form>
      </Modal>
    </Formik>
  );
}
