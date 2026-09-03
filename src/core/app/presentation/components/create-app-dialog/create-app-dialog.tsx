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
import { createAppSchema, type CreateAppSchema } from '@/core/app/presentation/schemas/create-app.schema';
import { useCreateApp } from '@/core/app/presentation/hooks/use-create-app/useCreateApp.hook';
import type { AppDict } from '@/core/app/presentation/i18n/en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

export interface CreateAppDialogProps {
  dict: WidenStringLiterals<AppDict>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateAppDialog({ dict, open, onOpenChange }: CreateAppDialogProps) {
  const createApp = useCreateApp();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAppSchema>({ resolver: zodResolver(createAppSchema) });

  const onSubmit = handleSubmit((data) => {
    createApp.mutate(
      { name: data.name },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.createAppDialog.title}</DialogTitle>
          <DialogDescription>{dict.createAppDialog.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          {createApp.isError && <Alert variant="error" message={dict.createAppDialog.errors.generic} />}

          <FormField
            label={dict.createAppDialog.name.label}
            error={errors.name && dict.validation.nameRequired}
          >
            <Input placeholder={dict.createAppDialog.name.placeholder} {...register('name')} />
          </FormField>

          <DialogFooter>
            <Button type="submit" loading={createApp.isPending}>
              {createApp.isPending ? dict.createAppDialog.submitting : dict.createAppDialog.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

CreateAppDialog.displayName = 'CreateAppDialog';

export { CreateAppDialog };
