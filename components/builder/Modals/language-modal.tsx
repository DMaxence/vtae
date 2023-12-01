"use client";
import React from "react";

import * as yup from "yup";

import CancelButton from "@/components/cancel-button";
import ModalTitle from "@/components/modal-title";
import SubmitButton from "@/components/submit-button";
import useSWR from "swr";

import { useModal } from "@/components/modal/provider";
import { fetcher } from "@/lib/utils";
import { useSession } from "next-auth/react";

import DeleteButton from "@/components/delete-button";
import Select from "@/components/select";
import { WithSiteId } from "@/lib/types";
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";

import type { Language } from "@prisma/client";

import { languageFields } from "@/constants/fields";

interface LanguageModalProps extends WithSiteId {
  languageId?: string;
}

const LanguageModal = ({ siteId, languageId }: LanguageModalProps) => {
  const modal = useModal();
  const [updatingInfos, setUpdatingInfos] = React.useState<boolean>(false);
  const [deleting, setDeleting] = React.useState<boolean>(false);

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

  const sendData = async (
    values: Language,
    actions: FormikHelpers<FormikValues>,
  ) => {
    // setUpdatingInfos(true)
    // const res = await fetch('/api/language', {
    //   method: languageId ? HttpMethod.PUT : HttpMethod.POST,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     ...values,
    //     ...(languageId && { id: languageId }),
    //   }),
    // })
    // if (res.ok) {
    //   const data = await res.json()
    //   // push data on redux store
    //   mutate('/api/language')
    //   toast.success(`Language ${languageId ? 'updated' : 'created'}`)
    //   actions.resetForm()
    //   setShowModal(false)
    // }
    // if (res) setUpdatingInfos(false)
  };

  const onDelete = async () => {
    // setDeleting(true)
    // const res = await fetch('/api/language', {
    //   method: HttpMethod.DELETE,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     languageId: languageId,
    //   }),
    // })
    // if (res.ok) {
    //   // push data on redux store
    //   mutate('/api/language')
    //   toast.success('Language deleted')
    //   setShowModal(false)
    // }
    // if (res) setDeleting(false)
  };

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={languageFields.reduce((acc, field) => {
        acc[field.name] = (languageId ? language?.[field.name] : null) ?? "";
        return acc;
      }, {})}
      onSubmit={(values, actions) => {
        sendData(values as Language, actions);
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
          modal?.hide();
        };

        return (
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
                  <DeleteButton onDelete={onDelete} loading={deleting} />
                </div>
              )}
              <div className="flex gap-3.5 self-start">
                <CancelButton onCancel={onCancel} />
                <SubmitButton loading={updatingInfos} />
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default LanguageModal;
