import { createSubmission } from "./submission.service.js";

import type { Request, Response } from "express";

export const submitForm = async (
  req: Request<{ formId: string }>,
  res: Response,
) => {
  const { formId } = req.params;

  const submission = await createSubmission(formId, req.body);

  res.status(201).json({
    message: "Form submitted successfully",
    data: submission,
  });
};
