import { render, screen } from '@testing-library/react';
import { BarChart } from './bar-chart';

const data5 = [
  { label: 'A', value: 10 },
  { label: 'B', value: 20 },
  { label: 'C', value: 30 },
  { label: 'D', value: 40 },
  { label: 'E', value: 50 },
];

describe('BarChart', () => {
  it('renders 5 rect elements for 5 data points', () => {
    const { container } = render(<BarChart data={data5} />);
    expect(container.querySelectorAll('rect')).toHaveLength(5);
  });

  it('bar B height is half bar A height for values [100, 50]', () => {
    const { container } = render(
      <BarChart data={[{ label: 'A', value: 100 }, { label: 'B', value: 50 }]} />,
    );
    const rects = container.querySelectorAll('rect');
    const heightA = parseFloat(rects[0].getAttribute('height') ?? '0');
    const heightB = parseFloat(rects[1].getAttribute('height') ?? '0');
    expect(heightB).toBeCloseTo(heightA / 2, 1);
  });

  it('renders label text for each bar', () => {
    render(<BarChart data={[{ label: 'Jan', value: 10 }]} />);
    expect(screen.getByText('Jan')).toBeInTheDocument();
  });

  it('merges className on root svg', () => {
    const { container } = render(<BarChart data={data5} className="mt-4" />);
    expect(container.querySelector('svg')).toHaveClass('mt-4');
  });
});
