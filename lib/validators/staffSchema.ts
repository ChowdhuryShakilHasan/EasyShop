import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "staff"]),
});

export type StaffFormValues = z.infer<typeof staffSchema>;