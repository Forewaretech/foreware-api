import z from "zod";

export const userValidationSchema = z.object({
  body: z.object({
    email: z.email(),
    name: z.string().min(1, "name is required"),
    password: z
      .string()
      .min(8, "password should not be less than 8 characters"),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "USER"]).optional(),
  }),
});

export type UserDTO = z.infer<typeof userValidationSchema>["body"];
