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

import TextArea from "@/components/textarea";

import DatePicker from "@/components/date-picker";
import DeleteButton from "@/components/delete-button";
import Select from "@/components/select";
import { WithSiteId } from "@/lib/types";
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";

import type { Education } from "@prisma/client";

import { educationFields } from "@/constants/fields";

interface EducationModalProps extends WithSiteId {
  educationId?: string;
}

const EducationModal = ({ siteId, educationId }: EducationModalProps) => {
  const modal = useModal();
  const [updatingInfos, setUpdatingInfos] = React.useState<boolean>(false);
  const [deleting, setDeleting] = React.useState<boolean>(false);

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

  const sendData = async (
    values: Education,
    actions: FormikHelpers<FormikValues>,
  ) => {
    // setUpdatingInfos(true);
    // const res = await fetch("/api/education", {
    //   method: educationId ? HttpMethod.PUT : HttpMethod.POST,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     ...values,
    //     ...(educationId && { id: educationId }),
    //   }),
    // });
    // if (res.ok) {
    //   const data = await res.json();
    //   // push data on redux store
    //   mutate("/api/education");
    //   toast.success(`Education ${educationId ? "updated" : "created"}`);
    //   actions.resetForm();
    //   setShowModal(false);
    // }
    // if (res) setUpdatingInfos(false);
  };

  const onDelete = async () => {
    // setDeleting(true);
    // const res = await fetch("/api/education", {
    //   method: HttpMethod.DELETE,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     educationId: educationId,
    //   }),
    // });
    // if (res.ok) {
    //   // push data on redux store
    //   mutate("/api/education");
    //   toast.success("Education deleted");
    //   setShowModal(false);
    // }
    // if (res) setDeleting(false);
  };

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={educationFields.reduce((acc, field) => {
        acc[field.name] = (educationId ? education?.[field.name] : null) ?? "";
        return acc;
      }, {})}
      onSubmit={(values, actions) => {
        sendData(values as Education, actions);
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
          modal?.hide();
        };

        return (
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

export default EducationModal;
