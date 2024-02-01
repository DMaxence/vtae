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

import type { Project, Skill } from "@prisma/client";

import { projectFields } from "@/constants/fields";

import TextArea from "@/components/textarea";

import DatePicker from "@/components/date-picker";
import DeleteButton from "@/components/delete-button";
import Modal from "@/components/modal";
import Select from "@/components/select";
import SkillAutocomplete from "@/components/skill-autocomplete";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/builder/project";
import { InitialValuesType, WithShowModal, WithSiteId } from "@/lib/types";
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";
import { toast } from "sonner";

interface ProjectModalProps extends WithSiteId, WithShowModal {
  projectId?: string;
}

const ProjectModal = ({
  showModal,
  setShowModal,
  siteId,
  projectId,
}: ProjectModalProps) => {
  const [isUpdating, startUpdateTransition] = React.useTransition();
  const [isDeleting, startDeleteTransition] = React.useTransition();

  const { status } = useSession();

  const { data: project } = useSWR<
    Project & {
      skills: Skill[];
    }
  >(
    status === "authenticated" &&
      projectId &&
      `/api/builder/${siteId}/project?projectId=${projectId}`,
    fetcher,
  );

  const validationSchema = yup.object({
    type: yup.string().required("Required"),
    url: yup.string(),
    title: yup.string().required("Required"),
    startDate: yup.date().required("Required"),
    endDate: yup.date(),
    skills: yup.array().of(yup.string()).min(1, "Required"),
    description: yup.string().required("Required"),
  });

  const onSubmit = async (
    values: Project,
    actions: FormikHelpers<FormikValues>,
  ) => {
    startUpdateTransition(async () => {
      const res = await (projectId
        ? updateProject({ ...values, id: projectId }, siteId)
        : createProject(values, siteId));
      if (res.error) {
        toast.error(res.error);
      } else {
        mutate(`/api/builder/${siteId}/project`);
        mutate("/api/skill");
        setShowModal(false);
        actions.resetForm();
        toast.success(`Project ${projectId ? "updated" : "created"}`);
        takeWebsiteScreenshot(res.site);
      }
    });
  };

  const onDelete = async () => {
    startDeleteTransition(async () => {
      const res = await deleteProject({ projectId }, siteId);
      if (res.error) {
        toast.error(res.error);
      } else {
        mutate(`/api/builder/${siteId}/project`);
        mutate("/api/skill");
        setShowModal(false);
        toast.success("Project deleted");
      }
    });
  };

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={projectFields.reduce((acc: InitialValuesType, field) => {
        acc[field.name] =
          (projectId ? project?.[field.name as keyof typeof project] : null) ??
          "";
        return acc;
      }, {})}
      onSubmit={(values, actions) => {
        onSubmit(values as Project, actions);
        actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
      enableReinitialize={!!projectId}
    >
      {({ setFieldValue, resetForm }: FormikProps<InitialValuesType>) => {
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
              <ModalTitle title="Edit your project" />
              <div className="flex flex-wrap justify-between gap-y-5 px-8">
                {projectFields.map(({ ...field }) => {
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
                        skills={project?.skills}
                        setFieldValue={setFieldValue}
                        exists={!!projectId}
                        existingSkills={project?.skills}
                        {...field}
                      />
                    );
                  return <TextInput key={field.name} {...field} />;
                })}
              </div>
              <div className="mb-5 mt-3 flex w-full flex-row-reverse items-center justify-between px-8">
                {projectId && (
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

export default ProjectModal;
