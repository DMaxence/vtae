"use client";

import React from "react";

import * as yup from "yup";

import type { PersonalInfos } from "@prisma/client";

import CancelButton from "@/components/cancel-button";
import ModalTitle from "@/components/modal-title";
import SubmitButton from "@/components/submit-button";
import TextInput from "@/components/text-input";
import useSWR, { mutate } from "swr";

import { WithShowModal, WithSiteId } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";

import Modal from "@/components/modal";
import { currentInfosFields } from "@/constants/fields";
import { createOrUpdatePersonalInfos } from "@/lib/builder/personal-infos";
import { toast } from "sonner";

interface CurrentInfosModalProps extends WithSiteId, WithShowModal {}

const CurrentInfosModal = ({
  showModal,
  setShowModal,
  siteId,
}: CurrentInfosModalProps) => {
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
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <Form className="inline-block w-full max-w-2xl overflow-hidden rounded-lg border border-stone-200 bg-white pt-8 text-center align-middle shadow-md transition-all dark:border-stone-700 dark:bg-stone-900">
          <ModalTitle title="Edit your current informations" />
          <div className="mx-auto grid w-5/6 gap-y-5">
            {currentInfosFields.map((field) => (
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
  );
};

export default CurrentInfosModal;
