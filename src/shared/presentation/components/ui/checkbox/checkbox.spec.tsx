import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
  });

  it('fires onCheckedChange with true when clicked', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('renders in checked state when checked prop is true', () => {
    render(<Checkbox checked />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('renders indeterminate state', () => {
    render(<Checkbox checked="indeterminate" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('accepts additional className', () => {
    render(<Checkbox className="custom-class" />);
    expect(screen.getByRole('checkbox')).toHaveClass('custom-class');
  });
});
