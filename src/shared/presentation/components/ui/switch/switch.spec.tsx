import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './switch';

describe('Switch', () => {
  it('renders with role="switch"', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('fires onCheckedChange with true when clicked', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(<Switch onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('reflects checked state via aria-checked', () => {
    render(<Switch checked />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Switch disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('accepts additional className', () => {
    render(<Switch className="custom-class" />);
    expect(screen.getByRole('switch')).toHaveClass('custom-class');
  });
});
