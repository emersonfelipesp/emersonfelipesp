import { z } from "zod";

export const viewPathSchema = z
  .string()
  .trim()
  .min(1, "path required")
  .max(200, "path too long")
  .regex(/^\/[a-z0-9/_-]*$/, "invalid path");

export const viewBodySchema = z.object({
  path: viewPathSchema,
});

export type ViewBodyInput = z.infer<typeof viewBodySchema>;
