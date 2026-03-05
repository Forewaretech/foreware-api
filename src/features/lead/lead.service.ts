import { prisma } from "../../config/db.js";

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
  return prisma.lead.update({
    where: { id },
    data: { status },
  });
};

export const deleteLead = async (id: string) => {
  return prisma.lead.delete({
    where: { id },
  });
};
