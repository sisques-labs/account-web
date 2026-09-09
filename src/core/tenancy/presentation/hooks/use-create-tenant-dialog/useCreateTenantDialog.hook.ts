import { useCreateTenant } from '@/core/tenancy/presentation/hooks/use-create-tenant/useCreateTenant.hook';

export interface UseCreateTenantDialogParams {
  appId: string;
  onOpenChange: (open: boolean) => void;
  reset: () => void;
}

export function useCreateTenantDialog({ appId, onOpenChange, reset }: UseCreateTenantDialogParams) {
  const createTenant = useCreateTenant(appId);

  const submit = (name: string) => {
    createTenant.mutate(
      { appId, name },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  return { ...createTenant, submit, onOpenChange: handleOpenChange };
}
