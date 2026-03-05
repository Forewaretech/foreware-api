import { z } from "zod";

// Schema for registration request body
export const registerUserSchema = z.object({
  body: {
    name: z.string().min(1, "First name is required"),
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    roles: z.array(z.string()),
    permissions: z.array(z.string()),
  },
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
