import { z } from 'zod';
import { TenantRole } from '@/core/tenancy/domain/enums/tenant-role.enum';

export const addTenantMemberSchema = z.object({
  email: z.email(),
  role: z.enum(TenantRole),
});

export type AddTenantMemberSchema = z.infer<typeof addTenantMemberSchema>;
