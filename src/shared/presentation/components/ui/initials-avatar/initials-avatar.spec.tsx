import { render, screen } from '@testing-library/react';
import { InitialsAvatar } from './initials-avatar';

describe('InitialsAvatar', () => {
  it('renders "JD" from name="John Doe"', () => {
    render(<InitialsAvatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders "A" from name="Ana"', () => {
    render(<InitialsAvatar name="Ana" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('deterministic: same name renders same background color class', () => {
    const { container: c1 } = render(<InitialsAvatar name="Maria" />);
    const { container: c2 } = render(<InitialsAvatar name="Maria" />);
    const cls1 = (c1.firstChild as HTMLElement).className;
    const cls2 = (c2.firstChild as HTMLElement).className;
    expect(cls1).toBe(cls2);
  });

  it('applies CVA lg size class for size="lg"', () => {
    const { container } = render(<InitialsAvatar name="Bob" size="lg" />);
    expect(container.firstChild).toHaveClass('h-12');
  });

  it('merges className prop', () => {
    const { container } = render(<InitialsAvatar name="Bob" className="ml-2" />);
    expect(container.firstChild).toHaveClass('ml-2');
  });
});
