import { deleteLead, getAllLeads, updateLeadStatus } from "./lead.service.js";

import type { Request, Response } from "express";

export const getLeads = async (req: Request, res: Response) => {
  const leads = await getAllLeads();
  res.json({ data: leads });
};

export const patchLeadStatus = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await updateLeadStatus(id, status);
  res.json({ data: updated });
};

export const removeLead = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  await deleteLead(id);
  res.json({ message: "Lead deleted" });
};
