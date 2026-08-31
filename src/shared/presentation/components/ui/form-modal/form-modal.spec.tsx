import { render, screen, fireEvent } from '@testing-library/react';
import { FormModal } from './form-modal';

function renderModal(overrides: Partial<React.ComponentProps<typeof FormModal>> = {}) {
  const onClose = vi.fn();
  const onSubmit = vi.fn((e) => e.preventDefault());
  render(
    <FormModal
      title="Modal title"
      onClose={onClose}
      onSubmit={onSubmit}
      isPending={false}
      cancelLabel="Cancel"
      submitLabel="Save"
      submittingLabel="Saving…"
      {...overrides}
    >
      <input aria-label="Name" />
    </FormModal>,
  );
  return { onClose, onSubmit };
}

describe('FormModal', () => {
  it('renders the title and form children', () => {
    renderModal();
    expect(screen.getByText('Modal title')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('renders beforeForm content above the form', () => {
    renderModal({ beforeForm: <p>Heads up</p> });
    expect(screen.getByText('Heads up')).toBeInTheDocument();
  });

  it('calls onClose when the cancel button is clicked', () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when the form is submitted', () => {
    const { onSubmit } = renderModal();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows the submitting label and disables buttons while pending', () => {
    renderModal({ isPending: true });
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('uses max-w-sm when maxWidth is sm', () => {
    renderModal({ maxWidth: 'sm' });
    expect(screen.getByText('Modal title').closest('[role="dialog"]')).toHaveClass('max-w-sm');
  });
});
