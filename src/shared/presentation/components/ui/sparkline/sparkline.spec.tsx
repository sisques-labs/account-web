import { render } from '@testing-library/react';
import { Sparkline } from './sparkline';

describe('Sparkline', () => {
  it('renders an SVG polyline for multi-point data', () => {
    const { container } = render(<Sparkline data={[1, 3, 2, 5, 4]} />);
    expect(container.querySelector('polyline')).toBeInTheDocument();
  });

  it('renders without error for single-point data', () => {
    const { container } = render(<Sparkline data={[5]} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies width and height to the svg element', () => {
    const { container } = render(<Sparkline data={[1, 2]} width={100} height={30} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '100');
    expect(svg).toHaveAttribute('height', '30');
  });

  it('merges className on root svg', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} className="inline" />);
    expect(container.querySelector('svg')).toHaveClass('inline');
  });
});
