import { render, screen } from '@testing-library/react';
import { EventCard } from './event-card';

describe('EventCard', () => {
  it('renders title and time', () => {
    render(<EventCard title="Water plants" time="09:00" />);
    expect(screen.getByText('Water plants')).toBeInTheDocument();
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  it('does not render empty location element when omitted', () => {
    const { container } = render(<EventCard title="Prune" time="10:00" />);
    expect(container.querySelector('[data-location]')).not.toBeInTheDocument();
  });

  it('accent applies inline style or class', () => {
    const { container } = render(<EventCard title="E" time="T" accent="#4CAF50" />);
    const accentEl = container.querySelector('[data-accent]') as HTMLElement;
    expect(accentEl).toBeTruthy();
    expect(accentEl.style.borderColor || accentEl.getAttribute('style')).toBeTruthy();
  });

  it('merges className prop', () => {
    const { container } = render(<EventCard title="E" time="T" className="p-2" />);
    expect(container.firstChild).toHaveClass('p-2');
  });
});
