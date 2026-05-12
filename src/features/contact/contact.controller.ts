import type { Request, Response } from "express";
import { contactUs } from "./contact.service.js";

export const contactUsController = async (req: Request, res: Response) => {
  res.status(202).json({
    status: "success",
    data: {
      message:
        "Your message has been received. We'll get back to you shortly.",
    },
  });

  void contactUs(req.body)
    .then((result) => {
      if (!result?.sent) {
        console.error("[contact] background email did not send:", result);
      }
    })
    .catch((err) => {
      console.error("[contact] background email crashed:", err);
    });
};
