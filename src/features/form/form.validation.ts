// form.validation.ts
import { z } from "zod";

export const formFieldSchema = z.object({
  label: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["TEXT", "EMAIL", "TEXTAREA", "NUMBER", "SELECT", "CHECKBOX"]),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
});

export const createFormSchema = z.object({
  name: z.string().min(1),
  trigger_type: z.enum(["embed", "popup"]),
  banner_image: z.string().url().optional(),
  thank_you_message: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),

  target_emails: z.array(z.string().email()).min(1),
  assigned_pages: z.array(z.string()).optional(),

  fields: z
    .array(
      z.object({
        label: z.string(),
        type: z.enum([
          "text",
          "email",
          "textarea",
          "number",
          "select",
          "checkbox",
        ]),
        required: z.boolean().optional(),
      }),
    )
    .min(1),
});

export type CreateFormDTO = z.infer<typeof createFormSchema>;
