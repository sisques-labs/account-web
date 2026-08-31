import { render, screen } from '@testing-library/react';
import { StatusDot } from './status-dot';

describe('StatusDot', () => {
  it('renders as a span element', () => {
    const { container } = render(<StatusDot status="good" />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('applies dot-good class for status="good"', () => {
    const { container } = render(<StatusDot status="good" />);
    expect(container.firstChild).toHaveClass('dot-good');
  });

  it('applies dot-warn class for status="warn"', () => {
    const { container } = render(<StatusDot status="warn" />);
    expect(container.firstChild).toHaveClass('dot-warn');
  });

  it('applies dot-bad class for status="bad"', () => {
    const { container } = render(<StatusDot status="bad" />);
    expect(container.firstChild).toHaveClass('dot-bad');
  });

  it('applies dot class for status="inactive"', () => {
    const { container } = render(<StatusDot status="inactive" />);
    expect(container.firstChild).toHaveClass('dot');
  });

  it('merges additional className', () => {
    const { container } = render(<StatusDot status="good" className="ml-2" />);
    expect(container.firstChild).toHaveClass('ml-2');
  });

  it('has no interactive role (purely visual)', () => {
    render(<StatusDot status="good" data-testid="dot" />);
    const dot = screen.getByTestId('dot');
    expect(dot).not.toHaveAttribute('role');
  });
});
