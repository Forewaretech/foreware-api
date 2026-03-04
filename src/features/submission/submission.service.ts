import { prisma } from "../../config/db.js";
import { createOrAttachLead } from "../lead/lead.service.js";
import { extractLeadData } from "../lead/lead.utils.js";

export const createSubmission = async (formId: string, submissionData: any) => {
  const form = await prisma.form.findUnique({
    where: { id: formId },
  });

  if (!form) {
    throw new Error("Form not found");
  }

  // Save submission
  const submission = await prisma.formSubmission.create({
    data: {
      formId,
      data: submissionData,
    },
  });

  // Extract lead info
  const { email, name } = extractLeadData(submissionData);

  // If email exists → create or attach lead
  if (email) {
    await createOrAttachLead(email, name ?? null, form.name, submission.id);
  }

  return submission;
};
