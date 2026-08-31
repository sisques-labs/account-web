import { render, screen } from '@testing-library/react';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No plants yet" description="Add your first plant" />);
    expect(screen.getByText('No plants yet')).toBeInTheDocument();
    expect(screen.getByText('Add your first plant')).toBeInTheDocument();
  });

  it('renders action render prop inside component', () => {
    render(<EmptyState title="Empty" action={<button>Add plant</button>} />);
    expect(screen.getByRole('button', { name: 'Add plant' })).toBeInTheDocument();
  });

  it('renders without error when no icon provided and title is visible', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('merges className prop', () => {
    const { container } = render(<EmptyState title="Empty" className="my-8" />);
    expect(container.firstChild).toHaveClass('my-8');
  });

  it('does not render description element when description is omitted', () => {
    const { container } = render(<EmptyState title="Empty" />);
    const desc = container.querySelector('[data-description]');
    expect(desc).not.toBeInTheDocument();
  });
});
