import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  it('renders the label', () => {
    render(<StatCard label="Total plants" value={42} />);
    expect(screen.getByText('Total plants')).toBeInTheDocument();
  });

  it('renders the value', () => {
    render(<StatCard label="Total plants" value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders the delta when provided', () => {
    render(<StatCard label="Total plants" value={42} delta="+3" />);
    expect(screen.getByText('+3')).toBeInTheDocument();
  });

  it('renders the icon when provided', () => {
    render(
      <StatCard label="Total plants" value={42} icon={<span data-testid="leaf-icon" />} />,
    );
    expect(screen.getByTestId('leaf-icon')).toBeInTheDocument();
  });

  it('renders without error when delta and icon are omitted', () => {
    expect(() => render(<StatCard label="Total plants" value={42} />)).not.toThrow();
  });

  it('container has card class', () => {
    const { container } = render(<StatCard label="Total plants" value={42} />);
    expect(container.firstChild).toHaveClass('card');
  });

  it('does not render delta slot when delta is omitted', () => {
    render(<StatCard label="Total plants" value={42} />);
    // No "+X" text
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
  });

  it('does not render icon slot when icon is omitted', () => {
    const { container } = render(<StatCard label="Total plants" value={42} />);
    // No icon container rendered
    const iconContainers = container.querySelectorAll('[data-testid]');
    expect(iconContainers.length).toBe(0);
  });
});
