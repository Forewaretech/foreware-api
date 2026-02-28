// form.service.ts
import { prisma } from "../../config/db.js";
import {
  FieldType,
  FormStatus,
  TriggerType,
} from "../../generated/prisma/enums.js";
import { removeUndefinedFields } from "../../utils/prisma_helpers.js";
import type { CreateFormDTO } from "./form.validation.js";

export const createForm = async (data: CreateFormDTO) => {
  const form = await prisma.form.create({
    data: {
      name: data.name,
      triggerType: data.trigger_type.toUpperCase() as TriggerType,
      ...removeUndefinedFields({
        bannerImage: data.banner_image,
        thankYouMessage: data.thank_you_message,
      }),
      targetEmails: data.target_emails,
      assignedPages: data.assigned_pages ?? [],
      status: (data.status?.toUpperCase() as FormStatus) ?? "ACTIVE",
      fields: {
        create: data.fields.map((field) => ({
          label: field.label,
          type: field.type.toUpperCase() as FieldType,
          required: field.required ?? false,
        })),
      },
    },
  });

  return form;
};

export const getAllForms = async () => {
  return await prisma.form.findMany({
    include: {
      fields: true,
    },
  });
};

export const getFormById = async (id: string) => {
  return await prisma.form.findUnique({
    where: { id },
    include: {
      fields: true,
    },
  });
};

export const deleteForm = async (id: string) => {
  return await prisma.form.delete({
    where: { id },
  });
};
