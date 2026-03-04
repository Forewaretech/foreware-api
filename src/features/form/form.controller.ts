// form.controller.ts
import type { Request, Response } from "express";
import * as formService from "./form.service.js";
import { createFormSchema } from "./form.validation.js";

export const createForm = async (req: Request, res: Response) => {
  const parsed = createFormSchema.parse(req.body);

  const form = await formService.createForm(parsed);

  res.status(201).json({
    success: true,
    data: form,
  });
};

export const updateFormController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const form = await formService.updateForm(req.params.id, req.body);
  res.json({ success: true, data: form });
};

export const getForms = async (_: Request, res: Response) => {
  const forms = await formService.getAllForms();
  res.json({ success: true, data: forms });
};

export const getFormsByStatusController = async (
  req: Request,
  res: Response,
) => {
  const forms = await formService.getActiveForms({
    status: req.query.status as string,
  });
  res.json({ success: true, data: forms });
};

export const getForm = async (req: Request, res: Response) => {
  const form = await formService.getFormById(req.params.id as string);

  if (!form) {
    return res.status(404).json({ message: "Form not found" });
  }

  res.json({ success: true, data: form });
};

export const deleteForm = async (req: Request, res: Response) => {
  await formService.deleteForm(req.params.id as string);
  res.json({ success: true });
};
