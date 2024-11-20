import { z } from "zod";

export const setupTenantSchema = z.object({
  name: z
    .string()
    .min(1, "content is too short")
    .max(20, "content is too long"),
  contactEmail: z.string().email("invalid email"),
});

export type Schema = z.infer<typeof setupTenantSchema>;
