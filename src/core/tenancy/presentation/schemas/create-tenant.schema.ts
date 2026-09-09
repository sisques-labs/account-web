import { z } from 'zod';

export const createTenantSchema = z.object({
  name: z.string().min(1),
});

export type CreateTenantSchema = z.infer<typeof createTenantSchema>;
