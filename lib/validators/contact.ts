import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "name required").max(100),
  email: z.string().trim().email("invalid email").max(200).transform((s) => s.toLowerCase()),
  message: z.string().trim().min(5, "message too short").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
