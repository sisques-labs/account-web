import { render, screen, fireEvent } from '@testing-library/react';
import { EntityRow, EntityRowAction } from './entity-row';

describe('EntityRow', () => {
  it('renders children content and actions', () => {
    render(
      <EntityRow actions={<span>actions-slot</span>}>
        <span>content-slot</span>
      </EntityRow>,
    );
    expect(screen.getByText('content-slot')).toBeInTheDocument();
    expect(screen.getByText('actions-slot')).toBeInTheDocument();
  });

  it('merges className', () => {
    const { container } = render(
      <EntityRow actions={null} className="custom-class">
        <span />
      </EntityRow>,
    );
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('rounded-lg', 'border');
  });

  it('keeps content and actions in a single row, vertically centered', () => {
    render(
      <EntityRow actions={<span>actions-slot</span>}>
        <span>content-slot</span>
      </EntityRow>,
    );
    expect(screen.getByTestId('entity-row-layout')).toHaveClass('items-center', 'justify-between');
    expect(screen.getByTestId('entity-row-layout')).not.toHaveClass('flex-col');
  });

  it('does not render an actions container when actions is omitted', () => {
    render(<EntityRow>content</EntityRow>);
    expect(screen.getByTestId('entity-row-layout').children).toHaveLength(1);
  });

  describe('complete checkbox', () => {
    it('does not render a checkbox when onComplete is not provided', () => {
      render(<EntityRow actions={null}>content</EntityRow>);
      expect(document.querySelector('.cbox')).toBeNull();
    });

    it('renders a checkbox when onComplete is provided', () => {
      render(
        <EntityRow actions={null} onComplete={() => {}} completeLabel="Complete">
          content
        </EntityRow>,
      );
      expect(screen.getByRole('button', { name: 'Complete' })).toHaveClass('cbox');
    });

    it('calls onComplete when the checkbox is clicked', () => {
      const onComplete = vi.fn();
      render(
        <EntityRow actions={null} onComplete={onComplete} completeLabel="Complete">
          content
        </EntityRow>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Complete' }));
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('shows the checkbox as done and disabled after it is clicked', () => {
      render(
        <EntityRow actions={null} onComplete={() => {}} completeLabel="Complete">
          content
        </EntityRow>,
      );
      const checkbox = screen.getByRole('button', { name: 'Complete' });
      fireEvent.click(checkbox);
      expect(checkbox).toHaveClass('done');
      expect(checkbox).toBeDisabled();
    });
  });

  describe('icon badge', () => {
    it('does not render a badge when icon is omitted', () => {
      render(<EntityRow actions={null}>content</EntityRow>);
      expect(screen.queryByTestId('entity-row-icon')).toBeNull();
    });

    it('renders the icon inside a variant-colored badge', () => {
      render(
        <EntityRow actions={null} icon={<svg data-testid="entity-row-icon" />} iconVariant="sky">
          content
        </EntityRow>,
      );
      const badge = screen.getByTestId('entity-row-icon').parentElement;
      expect(badge).toHaveClass('bg-[var(--sky-bg)]', 'text-[var(--sky)]');
    });
  });

  describe('overdue accent', () => {
    it('applies a terracotta left accent border when overdue', () => {
      const { container } = render(
        <EntityRow actions={null} overdue>
          content
        </EntityRow>,
      );
      expect(container.firstChild).toHaveClass('border-l-4', 'border-l-[var(--terracotta)]');
    });

    it('does not apply the accent border by default', () => {
      const { container } = render(<EntityRow actions={null}>content</EntityRow>);
      expect(container.firstChild).not.toHaveClass('border-l-4');
    });
  });
});

describe('EntityRowAction', () => {
  it('renders an icon button and fires onClick', () => {
    const onClick = vi.fn();
    render(<EntityRowAction icon={<svg />} label="Edit" onClick={onClick} />);

    const button = screen.getByRole('button', { name: 'Edit' });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders the icon, not the label, as visible content', () => {
    render(<EntityRowAction icon={<svg data-testid="edit-icon" />} label="Edit" onClick={() => {}} />);
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.queryByText('Edit')).toBeNull();
  });

  it('applies destructive styling for the destructive variant', () => {
    render(<EntityRowAction icon={<svg />} label="Delete" onClick={() => {}} variant="destructive" />);
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('text-destructive');
  });
});
