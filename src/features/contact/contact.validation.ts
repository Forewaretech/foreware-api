import z from "zod";

export const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name is required and above 2 character(s)"),
    email: z.email("Invalid email address"),
    phone: z.string().min(8, "Enter a valid phone number"),
    message: z.string().min(10, "Message should be above 10 character(s)"),
  }),
});

export type ContactType = z.infer<typeof contactSchema>["body"];
