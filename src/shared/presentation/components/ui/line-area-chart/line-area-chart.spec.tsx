import { render } from '@testing-library/react';
import { LineAreaChart } from './line-area-chart';

const data4 = [
  { x: 'Jan', y: 10 },
  { x: 'Feb', y: 30 },
  { x: 'Mar', y: 20 },
  { x: 'Apr', y: 40 },
];

describe('LineAreaChart', () => {
  it('renders an SVG polyline element', () => {
    const { container } = render(<LineAreaChart data={data4} />);
    expect(container.querySelector('polyline')).toBeInTheDocument();
  });

  it('renders a polygon or path element for filled area', () => {
    const { container } = render(<LineAreaChart data={data4} />);
    const area = container.querySelector('polygon') ?? container.querySelector('path');
    expect(area).toBeInTheDocument();
  });

  it('root svg has a viewBox attribute', () => {
    const { container } = render(<LineAreaChart data={data4} />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox');
  });

  it('merges className on root svg', () => {
    const { container } = render(<LineAreaChart data={data4} className="mt-2" />);
    expect(container.querySelector('svg')).toHaveClass('mt-2');
  });
});
