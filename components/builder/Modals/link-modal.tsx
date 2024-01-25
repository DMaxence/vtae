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
import { InitialValuesType, WithShowModal, WithSiteId } from "@/lib/types";
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";

import type { Link } from "@prisma/client";

import { linkFields } from "@/constants/fields";

import Modal from "@/components/modal";
import TextInput from "@/components/text-input";
import { createLink, deleteLink, updateLink } from "@/lib/builder/link";
import { toast } from "sonner";

interface LinkModalProps extends WithSiteId, WithShowModal {
  linkId?: string;
}

const LinkModal = ({
  showModal,
  setShowModal,
  siteId,
  linkId,
}: LinkModalProps) => {
  const [isUpdating, startUpdateTransition] = React.useTransition();
  const [isDeleting, startDeleteTransition] = React.useTransition();

  const { status } = useSession();

  const { data: link } = useSWR<Link>(
    status === "authenticated" &&
      linkId &&
      `/api/builder/${siteId}/link?linkId=${linkId}`,
    fetcher,
  );

  const validationSchema = yup.object({
    name: yup.string().required("Required"),
    url: yup.string().required("Required"),
    alt: yup.string(),
  });

  const onSubmit = async (
    values: Link,
    actions: FormikHelpers<FormikValues>,
  ) => {
    startUpdateTransition(async () => {
      const res = await (linkId
        ? updateLink({ ...values, id: linkId }, siteId)
        : createLink(values, siteId));
      if (res.error) {
        toast.error(res.error);
      } else {
        mutate(`/api/builder/${siteId}/link`);
        mutate("/api/skill");
        setShowModal(false);
        actions.resetForm();
        toast.success(`Link ${linkId ? "updated" : "created"}`);
      }
    });
  };

  const onDelete = async () => {
    startDeleteTransition(async () => {
      const res = await deleteLink({ linkId }, siteId);
      if (res.error) {
        toast.error(res.error);
      } else {
        mutate(`/api/builder/${siteId}/link`);
        mutate("/api/skill");
        setShowModal(false);
        toast.success("Link deleted");
      }
    });
  };

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={linkFields.reduce((acc: InitialValuesType, field) => {
        acc[field.name as string] =
          (linkId ? link?.[field.name as keyof typeof link] : null) ?? "";
        return acc;
      }, {})}
      onSubmit={(values, actions) => {
        onSubmit(values as Link, actions);
        actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
      enableReinitialize={!!linkId}
    >
      {({
        resetForm,
      }: FormikProps<{
        [key: string]: any;
      }>) => {
        const onCancel = () => {
          resetForm();
          setShowModal(false);
        };

        return (
          <Modal showModal={showModal} setShowModal={setShowModal}>
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

export default LinkModal;
