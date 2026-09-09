import { useCreateApp } from '@/core/app/presentation/hooks/use-create-app/useCreateApp.hook';

export interface UseCreateAppDialogParams {
  onOpenChange: (open: boolean) => void;
  reset: () => void;
}

export function useCreateAppDialog({ onOpenChange, reset }: UseCreateAppDialogParams) {
  const createApp = useCreateApp();

  const submit = (name: string) => {
    createApp.mutate(
      { name },
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

  return { ...createApp, submit, onOpenChange: handleOpenChange };
}
