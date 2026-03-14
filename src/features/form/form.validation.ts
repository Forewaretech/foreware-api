// form.validation.ts
import { z } from "zod";

export const formFieldSchema = z
  .object({
    label: z.string().min(1),
    type: z.enum([
      "text",
      "email",
      "textarea",
      "number",
      "select",
      "phone",
      "checkbox",
    ]),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional(),
  })
  .superRefine((field, ctx) => {
    if (
      (field.type === "select" || field.type === "checkbox") &&
      (!field.options || field.options.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Options are required for select and checkbox fields",
      });
    }
  });

export const createFormSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    triggerType: z.enum(["embed", "popup_load", "popup_scroll", "popup_time"]),
    bannerImage: z.string().url().optional().or(z.literal("")),
    thankYouMessage: z.string().optional(),
    status: z.enum(["active", "inactive"]).optional(),
    targetEmails: z.array(z.string().email()).optional(),
    assignedPages: z.array(z.string()).optional(),
    fields: z.array(formFieldSchema).min(1),
  }),
});

export const updateFormSchema = z.object({
  body: createFormSchema.shape.body.partial().extend({
    fields: z
      .array(
        formFieldSchema.extend({
          id: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

// export const updateFormSchema = createFormSchema.partial().extend({
//   fields: z
//     .array(
//       formFieldSchema.extend({
//         id: z.string().optional(), // important for existing fields
//       }),
//     )
//     .optional(),
// });

export type CreateFormDTO = z.infer<typeof createFormSchema>["body"];
export type UpdateFormDTO = z.infer<typeof updateFormSchema>["body"];
