'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/presentation/components/ui/button/button';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = ({ className, ref, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & { ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Overlay>> }) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
);

const DialogContent = ({ className, children, ref, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Content>> }) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'card fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--forest-2)] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-[var(--paper-2)] data-[state=open]:text-[var(--ink-3)]">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
);

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);

const DialogTitle = ({ className, ref, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & { ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Title>> }) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('headline text-xl', className)}
    {...props}
  />
);

const DialogDescription = ({ className, ref, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & { ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Description>> }) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-[var(--ink-3)]', className)}
    {...props}
  />
);

// ConfirmModal — composed from Dialog primitives
export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

const ConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
}: ConfirmModalProps) => (
  <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel(); onOpenChange(isOpen); }}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          className={cn(destructive ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : '')}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

DialogOverlay.displayName = 'DialogOverlay';
DialogContent.displayName = 'DialogContent';
DialogHeader.displayName = 'DialogHeader';
DialogFooter.displayName = 'DialogFooter';
DialogTitle.displayName = 'DialogTitle';
DialogDescription.displayName = 'DialogDescription';
ConfirmModal.displayName = 'ConfirmModal';

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  ConfirmModal,
};
