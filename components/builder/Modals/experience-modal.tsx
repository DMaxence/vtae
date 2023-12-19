"use client";
import React from "react";

import * as yup from "yup";

import CancelButton from "@/components/cancel-button";
import ModalTitle from "@/components/modal-title";
import SubmitButton from "@/components/submit-button";
import TextInput from "@/components/text-input";
import useSWR, { mutate } from "swr";

import { fetcher, takeWebsiteScreenshot } from "@/lib/utils";
import { useSession } from "next-auth/react";

import type { Experience, Skill } from "@prisma/client";

import { experienceFields } from "@/constants/fields";

import TextArea from "@/components/textarea";

import DatePicker from "@/components/date-picker";
import DeleteButton from "@/components/delete-button";
import Modal from "@/components/modal";
import Select from "@/components/select";
import SkillAutocomplete from "@/components/skill-autocomplete";
import {
  createExperience,
  deleteExperience,
  updateExperience,
} from "@/lib/builder/experience";
import { FormFieldsType, WithShowModal, WithSiteId } from "@/lib/types";
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";
import { toast } from "sonner";

interface ExperienceModalProps extends WithSiteId, WithShowModal {
  experienceId?: string;
}

const ExperienceModal = ({
  showModal,
  setShowModal,
  siteId,
  experienceId,
}: ExperienceModalProps) => {
  const [isUpdating, startUpdateTransition] = React.useTransition();
  const [isDeleting, startDeleteTransition] = React.useTransition();

  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const { data: experience } = useSWR<
    Experience & {
      skills: Skill[];
    }
  >(
    sessionId &&
      experienceId &&
      `/api/builder/${siteId}/experience?experienceId=${experienceId}`,
    fetcher,
  );

  const validationSchema = yup.object({
    type: yup.string().required("Required"),
    companyName: yup.string().required("Required"),
    companyUrl: yup.string(),
    jobTitle: yup.string().required("Required"),
    startDate: yup.date().required("Required"),
    endDate: yup.date(),
    location: yup.string(),
    skills: yup.array().of(yup.string()).min(1, "Required"),
    description: yup.string().required("Required"),
  });

  const onSubmit = async (
    values: Experience,
    actions: FormikHelpers<FormikValues>,
  ) => {
    startUpdateTransition(async () => {
      const res = await (experienceId
        ? updateExperience({ ...values, id: experienceId }, siteId)
        : createExperience(values, siteId));
      if (res.error) {
        toast.error(res.error);
      } else {
        mutate(`/api/builder/${siteId}/experience`);
        mutate("/api/skill");
        setShowModal(false);
        actions.resetForm();
        toast.success(`Experience ${experienceId ? "updated" : "created"}`);
        takeWebsiteScreenshot(res.site);
      }
    });
  };

  const onDelete = async () => {
    startDeleteTransition(async () => {
      const res = await deleteExperience({ experienceId }, siteId);
      if (res.error) {
        toast.error(res.error);
      } else {
        mutate(`/api/builder/${siteId}/experience`);
        mutate("/api/skill");
        setShowModal(false);
        toast.success("Experience deleted");
      }
    });
  };

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={experienceFields.reduce((acc, field) => {
        acc[field.name] =
          (experienceId
            ? experience?.[field.name as keyof typeof experience]
            : null) ?? "";
        return acc;
      }, {})}
      onSubmit={(values, actions) => {
        onSubmit(values as Experience, actions);
        actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
      enableReinitialize={!!experienceId}
    >
      {({
        setFieldValue,
        resetForm,
      }: FormikProps<Array<FormFieldsType>[keyof FormFieldsType[]]>) => {
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
              <ModalTitle title="Edit your experience" />
              <div className="flex flex-wrap justify-between gap-y-5 px-8">
                {experienceFields.map(({ ...field }) => {
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
                  if (field.type === "date")
                    return <DatePicker key={field.name} {...field} />;
                  if (field.type === "skills")
                    return (
                      <SkillAutocomplete
                        key={field.name}
                        skills={experience?.skills}
                        setFieldValue={setFieldValue}
                        experienceId={experienceId}
                        experience={experience}
                        {...field}
                      />
                    );
                  return <TextInput key={field.name} {...field} />;
                })}
              </div>
              <div className="mb-5 mt-3 flex w-full flex-row-reverse items-center justify-between px-8">
                {experienceId && (
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

export default ExperienceModal;
