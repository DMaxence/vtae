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
import { WithSiteId } from "@/lib/types";
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";

import type { Link } from "@prisma/client";

import { linkFields } from "@/constants/fields";

import TextInput from "@/components/text-input";

interface LinkModalProps extends WithSiteId {
  linkId?: string;
}

const LinkModal = ({ siteId, linkId }: LinkModalProps) => {
  const modal = useModal();
  const [updatingInfos, setUpdatingInfos] = React.useState<boolean>(false);
  const [deleting, setDeleting] = React.useState<boolean>(false);

  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const { data: link } = useSWR<Link>(
    sessionId && linkId && `/api/builder/${siteId}/link?linkId=${linkId}`,
    fetcher,
  );

  const validationSchema = yup.object({
    name: yup.string().required("Required"),
    url: yup.string().required("Required"),
    alt: yup.string(),
  });

  const sendData = async (
    values: Link,
    actions: FormikHelpers<FormikValues>,
  ) => {
    // setUpdatingInfos(true)
    // const res = await fetch('/api/link', {
    //   method: linkId ? HttpMethod.PUT : HttpMethod.POST,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     ...values,
    //     ...(linkId && { id: linkId }),
    //   }),
    // })
    // if (res.ok) {
    //   const data = await res.json()
    //   // push data on redux store
    //   mutate('/api/link')
    //   toast.success(`Link ${linkId ? 'updated' : 'created'}`)
    //   actions.resetForm()
    //   setShowModal(false)
    // }
    // if (res) setUpdatingInfos(false)
  };

  const onDelete = async () => {
    // setDeleting(true)
    // const res = await fetch('/api/link', {
    //   method: HttpMethod.DELETE,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     linkId: linkId,
    //   }),
    // })
    // if (res.ok) {
    //   // push data on redux store
    //   mutate('/api/link')
    //   toast.success('Link deleted')
    //   setShowModal(false)
    // }
    // if (res) setDeleting(false)
  };

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={linkFields.reduce((acc, field) => {
        acc[field.name] = (linkId ? link?.[field.name] : null) ?? "";
        return acc;
      }, {})}
      onSubmit={(values, actions) => {
        sendData(values as Link, actions);
        actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
      enableReinitialize={!!linkId}
    >
      {({
        resetForm,
      }: FormikProps<(typeof linkFields)[keyof typeof linkFields]>) => {
        const onCancel = () => {
          resetForm();
          modal?.hide();
        };

        return (
          <Form className="inline-block w-full max-w-3xl rounded-lg border border-stone-200 bg-white pt-8 text-center align-middle shadow-xl transition-all dark:border-stone-700 dark:bg-stone-900">
            <ModalTitle title="Edit your link" />
            <div className="flex flex-wrap justify-between gap-y-5 px-8">
              {linkFields.map(({ ...field }) => (
                <TextInput key={field.name} {...field} />
              ))}
            </div>
            <div className="mb-5 mt-3 flex w-full flex-row-reverse items-center justify-between px-8">
              {linkId && (
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

export default LinkModal;
