import { render, screen } from '@testing-library/react';
import { MediaCard } from './media-card';

describe('MediaCard', () => {
  it('renders image with alt text', () => {
    render(<MediaCard src="/p.jpg" alt="Plant" title="Fern" />);
    expect(screen.getByRole('img', { name: 'Plant' })).toBeInTheDocument();
  });

  it('horizontal variant applies CVA horizontal class', () => {
    const { container } = render(<MediaCard src="/p.jpg" alt="A" title="B" variant="horizontal" />);
    expect(container.firstChild).toHaveClass('flex-row');
  });

  it('actions slot renders children', () => {
    render(<MediaCard src="/p.jpg" alt="A" title="B" actions={<button>Delete</button>} />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('merges className prop', () => {
    const { container } = render(<MediaCard src="/p.jpg" alt="A" title="B" className="w-64" />);
    expect(container.firstChild).toHaveClass('w-64');
  });
});
