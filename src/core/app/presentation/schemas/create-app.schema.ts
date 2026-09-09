import { z } from 'zod';

export const createAppSchema = z.object({
  name: z.string().min(1),
});

export type CreateAppSchema = z.infer<typeof createAppSchema>;
