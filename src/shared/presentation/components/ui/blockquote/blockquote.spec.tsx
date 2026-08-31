import { render, screen } from '@testing-library/react';
import { Blockquote } from './blockquote';

describe('Blockquote', () => {
  it('renders as blockquote element', () => {
    render(<Blockquote>Text</Blockquote>);
    expect(document.querySelector('blockquote')).toBeInTheDocument();
  });

  it('cite attribute renders cite element', () => {
    render(<Blockquote cite="Journal">Note</Blockquote>);
    expect(screen.getByText('Journal')).toBeInTheDocument();
  });

  it('stat-highlight variant applies CVA class', () => {
    const { container } = render(<Blockquote variant="stat-highlight">42</Blockquote>);
    expect(container.querySelector('blockquote')).toHaveClass('text-4xl');
  });

  it('merges className prop', () => {
    const { container } = render(<Blockquote className="mt-4">body</Blockquote>);
    expect(container.firstChild).toHaveClass('mt-4');
  });
});
