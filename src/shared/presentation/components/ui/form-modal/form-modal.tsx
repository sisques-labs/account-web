import type { FormEventHandler, ReactNode } from 'react';
import { Button } from '@/shared/presentation/components/ui/button/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/presentation/components/ui/dialog/dialog';
import { cn } from '@/shared/lib/utils';

type FormModalProps = {
  title: ReactNode;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isPending: boolean;
  cancelLabel: string;
  submitLabel: string;
  submittingLabel: string;
  children: ReactNode;
  beforeForm?: ReactNode;
  maxWidth?: 'sm' | 'md';
};

function FormModal({
  title,
  onClose,
  onSubmit,
  isPending,
  cancelLabel,
  submitLabel,
  submittingLabel,
  children,
  beforeForm,
  maxWidth = 'md',
}: FormModalProps) {
  return (
    <Dialog open onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className={cn(maxWidth === 'sm' ? 'max-w-sm' : 'max-w-md', 'gap-4')}>
        <DialogHeader>
          <DialogTitle className="text-ink">{title}</DialogTitle>
        </DialogHeader>

        {beforeForm}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {children}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? submittingLabel : submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
FormModal.displayName = 'FormModal';

export { FormModal };
