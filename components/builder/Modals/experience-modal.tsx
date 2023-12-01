"use client";
import React from "react";

import * as yup from "yup";

import CancelButton from "@/components/cancel-button";
import ModalTitle from "@/components/modal-title";
import SubmitButton from "@/components/submit-button";
import TextInput from "@/components/text-input";
import useSWR from "swr";

import { useModal } from "@/components/modal/provider";
import { fetcher } from "@/lib/utils";
import { useSession } from "next-auth/react";

import type { Experience, Skill } from "@prisma/client";

import { experienceFields } from "@/constants/fields";

import TextArea from "@/components/textarea";

import SkillAutocomplete from "@/components/skill-autocomplete";
import DatePicker from "@/components/date-picker";
import DeleteButton from "@/components/delete-button";
import Select from "@/components/select";
import { WithSiteId } from "@/lib/types";
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";

interface ExperienceModalProps extends WithSiteId {
  experienceId?: string;
}

const ExperienceModal = ({ siteId, experienceId }: ExperienceModalProps) => {
  const modal = useModal();
  const [isPending, startTransition] = React.useTransition();
  const [updatingInfos, setUpdatingInfos] = React.useState<boolean>(false);
  const [deleting, setDeleting] = React.useState<boolean>(false);

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
    console.log("values", values);
    // setUpdatingInfos(true);
    // const res = await fetch("/api/experience", {
    //   method: experienceId ? HttpMethod.PUT : HttpMethod.POST,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     ...values,
    //     ...(experienceId && { id: experienceId }),
    //   }),
    // });
    // if (res.ok) {
    //   const data = await res.json();
    //   // push data on redux store
    //   mutate("/api/experience");
    //   mutate("/api/skill");
    //   toast.success(`Experience ${experienceId ? "updated" : "created"}`);
    //   actions.resetForm();
    //   setShowModal(false);
    // }
    // if (res) setUpdatingInfos(false);
  };

  const onDelete = async () => {
    // setDeleting(true);
    // const res = await fetch("/api/experience", {
    //   method: HttpMethod.DELETE,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     experienceId: experienceId,
    //   }),
    // });
    // if (res.ok) {
    //   // push data on redux store
    //   mutate("/api/experience");
    //   mutate("/api/skill");
    //   toast.success("Experience deleted");
    //   setShowModal(false);
    // }
    // if (res) setDeleting(false);
  };

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={experienceFields.reduce((acc, field) => {
        acc[field.name] =
          (experienceId ? experience?.[field.name] : null) ?? "";
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
      }: FormikProps<
        (typeof experienceFields)[keyof typeof experienceFields]
      >) => {
        const onCancel = () => {
          resetForm();
          modal?.hide();
        };

        return (
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

export default ExperienceModal;
