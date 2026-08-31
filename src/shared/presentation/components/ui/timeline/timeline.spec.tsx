import { render, screen } from '@testing-library/react';
import { Timeline } from './timeline';

const events3 = [
  { id: '1', timestamp: '2024-01-15', title: 'Event A' },
  { id: '2', timestamp: '2024-02-10', title: 'Event B' },
  { id: '3', timestamp: '2024-03-05', title: 'Event C', description: 'Details here' },
];

describe('Timeline', () => {
  it('renders all events', () => {
    render(<Timeline events={events3} />);
    expect(screen.getByText('Event A')).toBeInTheDocument();
    expect(screen.getByText('Event B')).toBeInTheDocument();
    expect(screen.getByText('Event C')).toBeInTheDocument();
  });

  it('renders timestamp text', () => {
    render(<Timeline events={events3} />);
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
  });

  it('does not render empty description element when omitted', () => {
    const { container } = render(<Timeline events={events3} />);
    const descEls = container.querySelectorAll('[data-description]');
    // only event C has description
    expect(descEls).toHaveLength(1);
  });

  it('merges className prop', () => {
    const { container } = render(<Timeline events={events3} className="mt-4" />);
    expect(container.firstChild).toHaveClass('mt-4');
  });
});
