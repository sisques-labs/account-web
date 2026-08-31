import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from './password-input';

describe('PasswordInput', () => {
  it('default type is password', () => {
    const { container } = render(<PasswordInput />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggle button click changes type to text', async () => {
    const { container } = render(<PasswordInput />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('password');
    await userEvent.click(screen.getByLabelText('Show password'));
    expect(input.type).toBe('text');
  });

  it('toggle button aria-label reflects state', async () => {
    render(<PasswordInput />);
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Show password'));
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
  });

  it('forwards ref to underlying input element', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement | null>;
    render(<PasswordInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
