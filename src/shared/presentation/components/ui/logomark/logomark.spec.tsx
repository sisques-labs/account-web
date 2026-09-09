import { render, screen } from '@testing-library/react';
import { Logomark } from './logomark';

describe('Logomark', () => {
  it('renders an svg with an accessible label', () => {
    render(<Logomark />);
    expect(screen.getByRole('img', { name: 'Sisqués' })).toBeInTheDocument();
  });

  it('defaults to a 40px size', () => {
    render(<Logomark data-testid="logomark" />);
    const svg = screen.getByTestId('logomark');
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('height', '40');
  });

  it('applies a custom size', () => {
    render(<Logomark size={26} data-testid="logomark" />);
    const svg = screen.getByTestId('logomark');
    expect(svg).toHaveAttribute('width', '26');
    expect(svg).toHaveAttribute('height', '26');
  });

  it('merges additional className', () => {
    render(<Logomark className="shrink-0" data-testid="logomark" />);
    expect(screen.getByTestId('logomark')).toHaveClass('shrink-0');
  });
});
