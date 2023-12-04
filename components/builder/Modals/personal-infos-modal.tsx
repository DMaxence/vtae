"use client";

import React from "react";

import * as yup from "yup";

import type { PersonalInfos } from "@prisma/client";

import CancelButton from "@/components/cancel-button";
import ModalTitle from "@/components/modal-title";
import SubmitButton from "@/components/submit-button";
import TextInput from "@/components/text-input";
import { personalInfosFields } from "@/constants/fields";
import useSWR, { mutate } from "swr";

import Modal from "@/components/modal";
import { useModal } from "@/components/modal/provider";
import { createOrUpdatePersonalInfos } from "@/lib/builder/personal-infos";
import { WithShowModal, WithSiteId } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PersonalInfosModalProps extends WithSiteId, WithShowModal {}

export default function PersonalInfosModal({
  showModal,
  setShowModal,
  siteId,
}: PersonalInfosModalProps) {
  const [isPending, startTransition] = React.useTransition();

  const { data: session } = useSession();

  const sessionId = session?.user?.id;

  const { data: personalInfos, isLoading } = useSWR<PersonalInfos>(
    sessionId && `/api/builder/${siteId}/personal-infos`,
    fetcher,
  );

  const validationSchema = yup.object({
    firstname: yup.string().trim().required("First name is required"),
    lastname: yup.string().trim().required("Last name is required"),
    title: yup.string().trim().nullable(),
    alias: yup.string().trim().nullable(),
  });

  const close = () => setShowModal(false);

  const onSubmit = (data: PersonalInfos) =>
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

  // async function updatePersonalInfos({
  //   firstname,
  //   lastname,
  //   title,
  //   alias,
  // }: PersonalInfos) {
  //   const res = await fetch("/api/personal-infos", {
  //     method: HttpMethod.POST,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       firstname: firstname,
  //       lastname: lastname,
  //       title: title,
  //       alias: alias,
  //     }),
  //   });
  //   if (res.ok) {
  //     const data = await res.json();
  //     // push data on redux store
  //     mutate("/api/personal-infos");
  //     toast.success("Personal infos updated");
  //     setShowModal(false);
  //     setUpdatingInfos(false);
  //   }
  // }

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={personalInfosFields.reduce((acc, field) => {
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
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <Form className="inline-block w-full max-w-2xl overflow-hidden rounded-lg border border-stone-200 bg-white pt-8 text-center align-middle shadow-md transition-all dark:border-stone-700 dark:bg-stone-900">
          <ModalTitle title="Edit your personal infos" />
          <div className="mx-auto grid w-5/6 gap-y-5">
            {personalInfosFields.map((field) => (
              <TextInput key={field.name} {...field} />
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

    // <Formik
    //   validateOnBlur={false}
    //   validateOnChange={false}
    //   initialValues={personalInfosFields.reduce((acc, field) => {
    //     acc[field.name] = personalInfos?.[field.name] ?? ''
    //     return acc
    //   }, {})}
    //   onSubmit={(values, actions) => {
    //     updatePersonalInfos(values as PersonalInfos)
    //     actions.setSubmitting(false)
    //   }}
    //   validationSchema={validationSchema}
    //   enableReinitialize
    // >
    //   {({
    //     isValid,
    //   }: FormikProps<
    //     typeof personalInfosFields[keyof typeof personalInfosFields]
    //   >) => (
    //       <Form className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg">
    //       </Form>
    //   )}
    // </Formik>
  );
}
