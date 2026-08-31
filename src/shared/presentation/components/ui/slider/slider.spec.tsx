import { render, screen, fireEvent } from '@testing-library/react';
import { Slider } from './slider';

describe('Slider', () => {
  it('renders input type range with correct attributes', () => {
    const { container } = render(<Slider min={0} max={100} step={5} defaultValue={50} />);
    const input = container.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.min).toBe('0');
    expect(input.max).toBe('100');
    expect(input.step).toBe('5');
  });

  it('shows current value when showValue is true', () => {
    render(<Slider value={30} showValue onChange={() => {}} />);
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('calls onChange with numeric value', () => {
    const fn = vi.fn();
    const { container } = render(<Slider onChange={fn} />);
    const input = container.querySelector('input[type="range"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '75' } });
    expect(fn).toHaveBeenCalledWith(75);
  });

  it('merges className prop', () => {
    const { container } = render(<Slider className="w-full" />);
    expect(container.firstChild).toHaveClass('w-full');
  });
});
