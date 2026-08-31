import { render, screen, fireEvent } from '@testing-library/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';

describe('Dialog', () => {
  it('does not render content when closed', () => {
    render(
      <Dialog open={false}>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders content when open', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Open Dialog</DialogTitle>
          <DialogDescription>Dialog body</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog body')).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when Escape is pressed', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Escape Test</DialogTitle>
          <DialogDescription>Press Escape</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders DialogHeader and DialogFooter', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>With Header</DialogTitle>
            <DialogDescription>With Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button>Dismiss</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByText('With Header')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });
});

describe('ConfirmModal', () => {
  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const { ConfirmModal } = await import('./dialog');
    render(
      <ConfirmModal
        open
        onOpenChange={vi.fn()}
        title="Delete item?"
        description="This cannot be undone."
        onConfirm={onConfirm}
        onCancel={onCancel}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const { ConfirmModal } = await import('./dialog');
    render(
      <ConfirmModal
        open
        onOpenChange={vi.fn()}
        title="Delete item?"
        description="This cannot be undone."
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('renders title and description', async () => {
    const { ConfirmModal } = await import('./dialog');
    render(
      <ConfirmModal
        open
        onOpenChange={vi.fn()}
        title="Are you sure?"
        description="This action is permanent."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This action is permanent.')).toBeInTheDocument();
  });

  it('applies destructive style on confirm button when destructive=true', async () => {
    const { ConfirmModal } = await import('./dialog');
    render(
      <ConfirmModal
        open
        onOpenChange={vi.fn()}
        title="Danger"
        description="Watch out."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        confirmLabel="Destroy"
        destructive
      />,
    );
    expect(screen.getByRole('button', { name: 'Destroy' })).toHaveClass('bg-destructive');
  });
});
