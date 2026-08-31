import { render, screen } from '@testing-library/react';
import { DonutChart } from './donut-chart';

const segments3 = [
  { label: 'A', value: 40 },
  { label: 'B', value: 35 },
  { label: 'C', value: 25 },
];

describe('DonutChart', () => {
  it('renders 3 SVG circle elements for 3 segments', () => {
    const { container } = render(<DonutChart segments={segments3} />);
    // circles for segments (background circle excluded)
    const circles = container.querySelectorAll('circle[data-segment]');
    expect(circles).toHaveLength(3);
  });

  it('renders center label text', () => {
    render(<DonutChart segments={segments3} centerLabel="12 plants" />);
    expect(screen.getByText('12 plants')).toBeInTheDocument();
  });

  it('segment strokeDasharray values sum to full circumference', () => {
    const size = 120;
    const r = size / 2 - 12;
    const circumference = 2 * Math.PI * r;
    const { container } = render(
      <DonutChart segments={[{ label: 'A', value: 75 }, { label: 'B', value: 25 }]} size={size} />,
    );
    const circles = container.querySelectorAll('circle[data-segment]');
    let totalArc = 0;
    circles.forEach((c) => {
      const val = c.getAttribute('stroke-dasharray');
      if (val) totalArc += parseFloat(val.split(/[\s,]/)[0]);
    });
    expect(totalArc).toBeCloseTo(circumference, 0);
  });

  it('merges className on root svg', () => {
    const { container } = render(<DonutChart segments={segments3} className="mx-auto" />);
    expect(container.querySelector('svg')).toHaveClass('mx-auto');
  });
});
