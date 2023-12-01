"use client";

import React from "react";

import * as yup from "yup";

import type { PersonalInfos } from "@prisma/client";

import CancelButton from "@/components/cancel-button";
import ModalTitle from "@/components/modal-title";
import SubmitButton from "@/components/submit-button";
import TextInput from "@/components/text-input";
import { personalInfosFields } from "@/constants/fields";
import useSWR from "swr";

import { useModal } from "@/components/modal/provider";
import { WithSiteId } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface PersonalInfosModalProps extends WithSiteId {}

export default function PersonalInfosModal({
  siteId,
}: PersonalInfosModalProps) {
  const router = useRouter();
  const modal = useModal();
  const [isPending, startTransition] = React.useTransition();

  const { data: session } = useSession();
  console.log("session", session);
  const sessionId = session?.user?.id;

  const { data: personalInfos, isLoading } = useSWR<PersonalInfos>(
    sessionId && `/api/builder/${siteId}/personal-infos`,
    fetcher,
  );

  console.log("personalInfos", personalInfos);

  const validationSchema = yup.object({
    firstname: yup.string().trim().required("First name is required"),
    lastname: yup.string().trim().required("Last name is required"),
    title: yup.string().trim().nullable(),
    alias: yup.string().trim().nullable(),
  });

  const onSubmit = (data: PersonalInfos) =>
    startTransition(async () => {
      // const res = createSite(data);
      // if (res.error) {
      //   toast.error(res.error);
      // } else {
      //   const { id } = res;
      //   router.refresh();
      //   router.push(`/site/${id}`);
      //   modal?.hide();
      //   toast.success(`Successfully created site!`);
      // }
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
      <Form className="inline-block w-full max-w-md overflow-hidden rounded-lg border border-stone-200 bg-white pt-8 text-center align-middle shadow-md transition-all dark:border-stone-700 dark:bg-stone-900">
        <ModalTitle title="Edit your personal infos" />
        <div className="mx-auto grid w-5/6 gap-y-5">
          {personalInfosFields.map((field) => (
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
