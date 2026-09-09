'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/presentation/components/ui/dialog/dialog';
import { Button } from '@/shared/presentation/components/ui/button/button';
import { Input } from '@/shared/presentation/components/ui/input/input';
import { FormField } from '@/shared/presentation/components/ui/form-field/form-field';
import { Alert } from '@/shared/presentation/components/ui/alert/alert';
import { createTenantSchema, type CreateTenantSchema } from '@/core/tenancy/presentation/schemas/create-tenant.schema';
import { useCreateTenantDialog } from '@/core/tenancy/presentation/hooks/use-create-tenant-dialog/useCreateTenantDialog.hook';
import type { TenancyDict } from '@/core/tenancy/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

export interface CreateTenantDialogProps {
  dict: WidenStringLiterals<TenancyDict>;
  appId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateTenantDialog({ dict, appId, open, onOpenChange }: CreateTenantDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTenantSchema>({ resolver: zodResolver(createTenantSchema) });
  const createTenant = useCreateTenantDialog({ appId, onOpenChange, reset });

  const onSubmit = handleSubmit((data) => {
    createTenant.submit(data.name);
  });

  return (
    <Dialog open={open} onOpenChange={createTenant.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.createTenantDialog.title}</DialogTitle>
          <DialogDescription>{dict.createTenantDialog.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          {createTenant.isError && (
            <Alert variant="error" message={dict.createTenantDialog.errors.generic} />
          )}

          <FormField
            label={dict.createTenantDialog.name.label}
            error={errors.name && dict.validation.nameRequired}
          >
            <Input placeholder={dict.createTenantDialog.name.placeholder} {...register('name')} />
          </FormField>

          <DialogFooter>
            <Button type="submit" loading={createTenant.isPending}>
              {createTenant.isPending ? dict.createTenantDialog.submitting : dict.createTenantDialog.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

CreateTenantDialog.displayName = 'CreateTenantDialog';

export { CreateTenantDialog };
