import { prisma } from "../../config/db.js";
import { logActivity } from "../activity/activity.service.js";

export const createOrAttachLead = async (
  email: string,
  name: string | null,
  formName: string,
  submissionId: string,
) => {
  const existingLead = await prisma.lead.findUnique({
    where: { email },
  });

  if (existingLead) {
    await prisma.formSubmission.update({
      where: { id: submissionId },
      data: { leadId: existingLead.id },
    });

    return existingLead;
  }

  const newLead = await prisma.lead.create({
    data: {
      email,
      name,
      source: formName,
      submissions: {
        connect: { id: submissionId },
      },
    },
  });

  await logActivity({
    action: "Updated Lead",
    detail: `Name: ${newLead.name}`,
    metadata: {
      leadId: newLead.id,
      date: Date.now(),
      userId: newLead?.source || "",
    },
  });

  return newLead;
};

export const getAllLeads = async () => {
  return prisma.lead.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      source: true,
      status: true,
      submissions: {
        select: {
          form: {
            select: {
              thankYouMessage: true,
              displayBehavior: true,
              closeBehavior: true,
              assignedPages: true,
            },
          },
          data: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateLeadStatus = async (id: string, status: any) => {
  const updatedLead = await prisma.lead.update({
    where: { id },
    data: { status },
  });

  await logActivity({
    action: "Updated Lead",
    detail: `Name: ${updatedLead.name}`,
    metadata: {
      leadId: updatedLead.id,
      date: Date.now(),
      userId: updatedLead?.source || "",
    },
  });

  return updatedLead;
};

export const deleteLead = async (id: string) => {
  const deletedLead = await prisma.lead.delete({
    where: { id },
  });

  await logActivity({
    action: "Deleted Lead",
    detail: `Name: ${deletedLead.name}`,
    metadata: {
      leadId: deletedLead.id,
      date: Date.now(),
      userId: deletedLead?.source || "",
    },
  });

  return deletedLead;
};
