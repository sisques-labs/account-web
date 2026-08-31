import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  it('renders title and description', () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={vi.fn()}
        title="Delete plant?"
        description="This action cannot be undone."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByText('Delete plant?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        open
        onOpenChange={vi.fn()}
        title="Confirm"
        description="Sure?"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
        confirmLabel="Yes"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        open
        onOpenChange={vi.fn()}
        title="Confirm"
        description="Sure?"
        onConfirm={vi.fn()}
        onCancel={onCancel}
        cancelLabel="No"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'No' }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('applies destructive style when destructive=true', () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={vi.fn()}
        title="Delete"
        description="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        confirmLabel="Delete"
        destructive
      />,
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('bg-destructive');
  });

  it('uses default labels when none provided', () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={vi.fn()}
        title="Confirm"
        description="Proceed?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});
