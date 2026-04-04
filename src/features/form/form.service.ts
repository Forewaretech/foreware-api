// form.service.ts
import { prisma } from "../../config/db.js";
import type { FormField } from "../../generated/prisma/client.js";
import {
  FieldType,
  FormStatus,
  TriggerType,
} from "../../generated/prisma/enums.js";
import { removeUndefinedFields } from "../../utils/prisma_helpers.js";
import { logActivity } from "../activity/activity.service.js";
import type { CreateFormDTO, UpdateFormDTO } from "./form.validation.js";

export const createForm = async (data: CreateFormDTO) => {
  const form = await prisma.form.create({
    data: {
      name: data.name,
      triggerType: data.triggerType.toUpperCase() as TriggerType,
      ...removeUndefinedFields({
        bannerImage: data.bannerImage,
        thankYouMessage: data.thankYouMessage,
      }),
      targetEmails: data.targetEmails ?? [],
      assignedPages: data.assignedPages ?? [],
      status: (data.status?.toUpperCase() as FormStatus) ?? "INACTIVE",
      fields: {
        create: data.fields.map((field) => ({
          label: field.label,
          type: field.type.toUpperCase() as FieldType,
          required: field.required ?? false,
          options: field.options ?? [],
        })),
      },
    },
  });

  await logActivity({
    action: "Created Form",
    detail: `Name: ${form.name}`,
    metadata: { formId: form.id, date: Date.now() },
    userId: form.userId || "",
  });

  return form;
};

// form.service.ts

export const updateForm = async (id: string, data: UpdateFormDTO) => {
  console.log("UPDATE: ", data, data.status?.toUpperCase());

  return await prisma.$transaction(async (tx) => {
    // 1️ Update form basic data
    const updatedForm = await tx.form.update({
      where: { id },
      data: removeUndefinedFields({
        name: data.name,
        triggerType: data.triggerType?.toUpperCase() as TriggerType,
        bannerImage: data.bannerImage,
        thankYouMessage: data.thankYouMessage,
        targetEmails: data.targetEmails,
        assignedPages: data.assignedPages,
        status: data.status?.toUpperCase() as FormStatus,
      }),
    });

    if (!data.fields) return updatedForm;

    // 2️ Get existing fields
    const existingFields = await tx.formField.findMany({
      where: { formId: id },
    });

    const existingIds = existingFields.map((f: FormField) => f.id);
    const incomingIds = data.fields
      .filter((f) => f.id)
      .map((f) => f.id as string);

    // 3️ Delete removed fields
    const idsToDelete = existingIds.filter(
      (existingId: string) => !incomingIds.includes(existingId),
    );

    if (idsToDelete.length > 0) {
      await tx.formField.deleteMany({
        where: { id: { in: idsToDelete } },
      });
    }

    // 4️ Update or create fields
    for (const field of data.fields) {
      if (field.id) {
        // Update existing
        await tx.formField.update({
          where: { id: field.id },
          data: {
            label: field.label,
            type: field.type.toUpperCase() as FieldType,
            required: field.required ?? false,
            options: field.options ?? [],
          },
        });
      } else {
        // Create new
        await tx.formField.create({
          data: {
            formId: id,
            label: field.label,
            type: field.type.toUpperCase() as FieldType,
            required: field.required ?? false,
            options: field.options ?? [],
          },
        });
      }
    }

    await logActivity({
      action: "Updated Form",
      detail: `Name: ${updatedForm.name}`,
      metadata: { formId: updatedForm.id, date: Date.now() },
      userId: updatedForm.userId || "",
    });

    return updatedForm;
  });
};

export const getAllForms = async () => {
  return await prisma.form.findMany({
    include: {
      fields: true,
    },
  });
};

export const getActiveForms = async (op: { status: string }) => {
  return await prisma.form.findMany({
    where: {
      status: op.status as FormStatus,
    },
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
  const deteledPost = await prisma.form.delete({
    where: { id },
  });

  await logActivity({
    action: "Deleted Form",
    detail: `Name: ${deteledPost.name}`,
    metadata: { formId: deteledPost.id, date: Date.now() },
    userId: deteledPost.userId || "",
  });

  return;
};
