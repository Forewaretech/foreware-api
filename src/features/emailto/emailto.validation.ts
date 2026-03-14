import z from "zod";

export const emailToSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    cc: z.string().optional(),
  }),
});

export type EmailToType = z.infer<typeof emailToSchema>["body"];
