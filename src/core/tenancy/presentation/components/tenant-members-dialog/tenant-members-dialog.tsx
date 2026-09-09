'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/presentation/components/ui/dialog/dialog';
import { Button } from '@/shared/presentation/components/ui/button/button';
import { Input } from '@/shared/presentation/components/ui/input/input';
import { FormField } from '@/shared/presentation/components/ui/form-field/form-field';
import { Alert } from '@/shared/presentation/components/ui/alert/alert';
import { Badge } from '@/shared/presentation/components/ui/badge/badge';
import { Skeleton } from '@/shared/presentation/components/ui/skeleton/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/presentation/components/ui/select/select';
import { useTenantMembers } from '@/core/tenancy/presentation/hooks/use-tenant-members/useTenantMembers.hook';
import { useAddTenantMember } from '@/core/tenancy/presentation/hooks/use-add-tenant-member/useAddTenantMember.hook';
import {
  addTenantMemberSchema,
  type AddTenantMemberSchema,
} from '@/core/tenancy/presentation/schemas/add-tenant-member.schema';
import { TenantRole } from '@/core/tenancy/domain/enums/tenant-role.enum';
import { t } from '@/shared/presentation/i18n/interpolate';
import type { TenancyDict } from '@/core/tenancy/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

export interface TenantMembersDialogProps {
  dict: WidenStringLiterals<TenancyDict>;
  tenantId: string;
  tenantName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function TenantMembersDialog({ dict, tenantId, tenantName, open, onOpenChange }: TenantMembersDialogProps) {
  const membersQuery = useTenantMembers(tenantId, open);
  const addMember = useAddTenantMember(tenantId);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddTenantMemberSchema>({
    resolver: zodResolver(addTenantMemberSchema),
    defaultValues: { role: TenantRole.MEMBER },
  });

  const onSubmit = handleSubmit((data) => {
    addMember.mutate(
      { tenantId, email: data.email, role: data.role },
      { onSuccess: () => reset({ email: '', role: TenantRole.MEMBER }) },
    );
  });

  // account-api's tenantMemberAdd throws a GraphQL error (not surfaced with a
  // stable, documented error code today) when the email doesn't match an
  // existing user — shown as a single generic message rather than guessing
  // at an error-code contract that isn't confirmed.
  const errorMessage = addMember.isError ? dict.membersDialog.addMember.errors.generic : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset({ email: '', role: TenantRole.MEMBER });
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(dict.membersDialog.title, { name: tenantName })}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {membersQuery.isLoading && (
            <div className="flex flex-col gap-2">
              <Skeleton variant="line" />
              <Skeleton variant="line" />
            </div>
          )}

          {membersQuery.isSuccess && membersQuery.data.length === 0 && (
            <p className="text-sm text-[var(--ink-3)]">{dict.membersDialog.empty}</p>
          )}

          {membersQuery.isSuccess && membersQuery.data.length > 0 && (
            <ul className="flex flex-col gap-2">
              {membersQuery.data.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between border-b border-[var(--rule)] pb-2 last:border-b-0"
                >
                  <span className="font-mono text-xs text-[var(--ink)]">{member.userId}</span>
                  <Badge variant="forest">{dict.roles[member.role]}</Badge>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={onSubmit} className="mt-2 flex flex-col gap-3" noValidate>
            {errorMessage && <Alert variant="error" message={errorMessage} />}

            <FormField
              label={dict.membersDialog.addMember.email.label}
              error={errors.email && dict.validation.emailInvalid}
            >
              <Input
                type="email"
                placeholder={dict.membersDialog.addMember.email.placeholder}
                {...register('email')}
              />
            </FormField>

            <FormField
              label={dict.membersDialog.addMember.role.label}
              error={errors.role && dict.validation.roleRequired}
            >
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TenantRole).map((role) => (
                        <SelectItem key={role} value={role}>
                          {dict.roles[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <Button type="submit" loading={addMember.isPending}>
              {addMember.isPending ? dict.membersDialog.addMember.submitting : dict.membersDialog.addMember.submit}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

TenantMembersDialog.displayName = 'TenantMembersDialog';

export { TenantMembersDialog };
