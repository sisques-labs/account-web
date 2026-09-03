import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  displayName: z.string().min(1).optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
