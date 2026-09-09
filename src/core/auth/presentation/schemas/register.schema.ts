import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  // No min(1): a blank input submits '' (not undefined), and this field is
  // optional -- treat '' the same as not provided (see useRegister.hook.ts,
  // which normalizes '' to undefined before sending).
  displayName: z.string().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
