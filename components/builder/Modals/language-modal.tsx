"use client";
import React from "react";

import * as yup from "yup";

import CancelButton from "@/components/cancel-button";
import ModalTitle from "@/components/modal-title";
import SubmitButton from "@/components/submit-button";
import useSWR, { mutate } from "swr";

import { fetcher } from "@/lib/utils";
import { useSession } from "next-auth/react";

import DeleteButton from "@/components/delete-button";
import Select from "@/components/select";
import { WithShowModal, WithSiteId } from "@/lib/types";
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";

import type { Language } from "@prisma/client";

import Modal from "@/components/modal";
import { languageFields } from "@/constants/fields";
import {
  createLanguage,
  deleteLanguage,
  updateLanguage,
} from "@/lib/builder/language";
import { toast } from "sonner";

interface LanguageModalProps extends WithSiteId, WithShowModal {
  languageId?: string;
}

const LanguageModal = ({
  showModal,
  setShowModal,
  siteId,
  languageId,
}: LanguageModalProps) => {
  const [isUpdating, startUpdateTransition] = React.useTransition();
  const [isDeleting, startDeleteTransition] = React.useTransition();

  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const { data: language } = useSWR<Language>(
    sessionId &&
      languageId &&
      `/api/builder/${siteId}/language?languageId=${languageId}`,
    fetcher,
  );

  const validationSchema = yup.object({
    name: yup.string().required("Required"),
  });

  const onSubmit = async (
    values: Language,
    actions: FormikHelpers<FormikValues>,
  ) => {
    startUpdateTransition(async () => {
      const res = await (languageId
        ? updateLanguage({ ...values, id: languageId }, siteId)
        : createLanguage(values, siteId));
      if (res.error) {
        toast.error(res.error);
      } else {
        mutate(`/api/builder/${siteId}/language`);
        mutate("/api/skill");
        setShowModal(false);
        actions.resetForm();
        toast.success(`Language ${languageId ? "updated" : "created"}`);
      }
    });
  };

  const onDelete = async () => {
    startDeleteTransition(async () => {
      const res = await deleteLanguage({ languageId }, siteId);
      if (res.error) {
        toast.error(res.error);
      } else {
        mutate(`/api/builder/${siteId}/language`);
        mutate("/api/skill");
        setShowModal(false);
        toast.success("Language deleted");
      }
    });
  };

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={languageFields.reduce((acc, field) => {
        acc[field.name] =
          (languageId
            ? language?.[field.name as keyof typeof language]
            : null) ?? "";
        return acc;
      }, {})}
      onSubmit={(values, actions) => {
        onSubmit(values as Language, actions);
        actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
      enableReinitialize={!!languageId}
    >
      {({
        setFieldValue,
        resetForm,
      }: FormikProps<(typeof languageFields)[keyof typeof languageFields]>) => {
        const onCancel = () => {
          resetForm();
          setShowModal(false);
        };

        return (
          <Modal showModal={showModal} setShowModal={setShowModal}>
            <Form className="inline-block w-full max-w-3xl rounded-lg border border-stone-200 bg-white pt-8 text-center align-middle shadow-xl transition-all dark:border-stone-700 dark:bg-stone-900">
              <ModalTitle title="Edit your language" />
              <div className="flex flex-wrap justify-between gap-y-5 px-8">
                {languageFields.map(({ ...field }) => (
                  <Select
                    key={field.name}
                    {...field}
                    setFieldValue={setFieldValue}
                  />
                ))}
              </div>
              <div className="mb-5 mt-3 flex w-full flex-row-reverse items-center justify-between px-8">
                {languageId && (
                  <div className="order-1">
                    <DeleteButton onDelete={onDelete} loading={isDeleting} />
                  </div>
                )}
                <div className="flex gap-3.5 self-start">
                  <CancelButton onCancel={onCancel} />
                  <SubmitButton loading={isUpdating} />
                </div>
              </div>
            </Form>
          </Modal>
        );
      }}
    </Formik>
  );
};

export default LanguageModal;
