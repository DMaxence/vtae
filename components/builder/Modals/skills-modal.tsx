"use client";

import React from "react";

import * as yup from "yup";

import type { Skill } from "@prisma/client";

import { Form, Formik, FormikProps } from "formik";

import CancelButton from "@/components/cancel-button";
import ModalTitle from "@/components/modal-title";
import SubmitButton from "@/components/submit-button";
import useSWR, { mutate } from "swr";

import { fetcher } from "@/lib/utils";
import { useSession } from "next-auth/react";

import { skillsFields } from "@/constants/fields";

import Modal from "@/components/modal";
import SkillAutocomplete from "@/components/skill-autocomplete";
import { updateSiteSkills } from "@/lib/builder/skill";
import { InitialValuesType, WithShowModal, WithSiteId } from "@/lib/types";
import { toast } from "sonner";

interface SkillsModalProps extends WithSiteId, WithShowModal {}

export default function SkillsModal({
  showModal,
  setShowModal,
  siteId,
}: SkillsModalProps) {
  const [isPending, startTransition] = React.useTransition();

  const { status } = useSession();

  const { data: siteSkills } = useSWR<Skill[]>(
    status === "authenticated" && `/api/builder/${siteId}/skills`,
    fetcher,
  );
  const { data: projectSkills } = useSWR<Skill[]>(
    status === "authenticated" && `/api/builder/${siteId}/project-skills`,
    fetcher,
  );

  const skills = [...(projectSkills || []), ...(siteSkills || [])];

  const validationSchema = yup.object({
    skills: yup.array().of(yup.object()).min(1, "Required"),
  });

  const close = () => setShowModal(false);

  const onSubmit = async (data: {
    skills: Skill[];
    removeSkills?: string[];
  }) => {
    const skills = data.skills.filter(
      (skill) => !projectSkills?.find((s) => s.id === skill.id),
    );
    startTransition(async () => {
      const res = await updateSiteSkills(
        { skills, removeSkills: data.removeSkills },
        siteId,
      );
      if (res.error) {
        toast.error(res.error);
      } else {
        mutate(`/api/builder/${siteId}/skills`);
        close();
        toast.success(`Successfully updated your skills!`);
      }
    });
  };

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={skillsFields.reduce((acc: InitialValuesType, field) => {
        acc[field.name] = skills?.[field.name as keyof typeof skills] ?? "";
        return acc;
      }, {})}
      onSubmit={(values, actions) => {
        onSubmit(
          values as {
            skills: Skill[];
            removeSkills?: string[];
          },
        );
        actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ setFieldValue }: FormikProps<InitialValuesType>) => (
        <Modal showModal={showModal} setShowModal={setShowModal}>
          <Form className="inline-block w-full max-w-2xl rounded-lg border border-stone-200 bg-white pt-8 text-center align-middle shadow-md transition-all dark:border-stone-700 dark:bg-stone-900">
            <ModalTitle title="Edit your skills" />
            <div className="mx-auto grid w-5/6 gap-y-5">
              {skillsFields.map((field) => (
                <SkillAutocomplete
                  key={field.name}
                  canDeleteExisting={false}
                  skills={skills}
                  setFieldValue={setFieldValue}
                  exists
                  existingSkills={siteSkills}
                  {...field}
                />
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
      )}
    </Formik>
  );
}
