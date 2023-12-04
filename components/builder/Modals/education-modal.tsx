"use client";
import React from "react";

import * as yup from "yup";

import CancelButton from "@/components/cancel-button";
import ModalTitle from "@/components/modal-title";
import SubmitButton from "@/components/submit-button";
import TextInput from "@/components/text-input";
import useSWR, { mutate } from "swr";

import { useModal } from "@/components/modal/provider";
import { fetcher } from "@/lib/utils";
import { useSession } from "next-auth/react";

import TextArea from "@/components/textarea";

import DatePicker from "@/components/date-picker";
import DeleteButton from "@/components/delete-button";
import Select from "@/components/select";
import { WithShowModal, WithSiteId } from "@/lib/types";
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";

import type { Education } from "@prisma/client";

import Modal from "@/components/modal";
import { educationFields } from "@/constants/fields";
import {
  createEducation,
  deleteEducation,
  updateEducation,
} from "@/lib/builder/education";
import { toast } from "sonner";

interface EducationModalProps extends WithSiteId, WithShowModal {
  educationId?: string;
}

const EducationModal = ({
  showModal,
  setShowModal,
  siteId,
  educationId,
}: EducationModalProps) => {
  const modal = useModal();
  const [isUpdating, startUpdateTransition] = React.useTransition();
  const [isDeleting, startDeleteTransition] = React.useTransition();

  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const { data: education } = useSWR<Education>(
    sessionId &&
      educationId &&
      `/api/builder/${siteId}/education?educationId=${educationId}`,
    fetcher,
  );

  const validationSchema = yup.object({
    place: yup.string().required("Required"),
    degree: yup.string(),
    degreeField: yup.string(),
    country: yup.string(),
    city: yup.string(),
    startDate: yup.date().required("Required"),
    endDate: yup.date(),
    description: yup.string(),
  });

  const onSubmit = async (
    values: Education,
    actions: FormikHelpers<FormikValues>,
  ) => {
    startUpdateTransition(async () => {
      const res = await (educationId
        ? updateEducation({ ...values, id: educationId }, siteId)
        : createEducation(values, siteId));
      if (res.error) {
        toast.error(res.error);
      } else {
        mutate(`/api/builder/${siteId}/education`);
        mutate("/api/skill");
        setShowModal(false);
        actions.resetForm();
        toast.success(`Education ${educationId ? "updated" : "created"}`);
      }
    });
  };

  const onDelete = async () => {
    startDeleteTransition(async () => {
      const res = await deleteEducation({ educationId }, siteId);
      if (res.error) {
        toast.error(res.error);
      } else {
        mutate(`/api/builder/${siteId}/education`);
        mutate("/api/skill");
        setShowModal(false);
        toast.success("Education deleted");
      }
    });
  };

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={educationFields.reduce((acc, field) => {
        acc[field.name] =
          education?.[field.name as keyof typeof education] ?? "";
        return acc;
      }, {})}
      onSubmit={(values, actions) => {
        onSubmit(values as Education, actions);
        actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
      enableReinitialize={!!educationId}
    >
      {({
        setFieldValue,
        resetForm,
      }: FormikProps<
        (typeof educationFields)[keyof typeof educationFields]
      >) => {
        const onCancel = () => {
          resetForm();
          setShowModal(false);
        };

        return (
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            onClose={resetForm}
          >
            <Form className="inline-block w-full max-w-3xl rounded-lg border border-stone-200 bg-white pt-8 text-center align-middle shadow-xl transition-all dark:border-stone-700 dark:bg-stone-900">
              <ModalTitle title="Edit your education" />
              <div className="flex flex-wrap justify-between gap-y-5 px-8">
                {educationFields.map(({ ...field }) => {
                  if (field.type === "textarea")
                    return <TextArea key={field.name} {...field} />;
                  if (field.type === "select")
                    return (
                      <Select
                        key={field.name}
                        {...field}
                        setFieldValue={setFieldValue}
                      />
                    );
                  if (field.type === "date" || field.type === "month")
                    return <DatePicker key={field.name} {...field} />;
                  return <TextInput key={field.name} {...field} />;
                })}
              </div>
              <div className="mb-5 mt-3 flex w-full flex-row-reverse items-center justify-between px-8">
                {educationId && (
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

export default EducationModal;
