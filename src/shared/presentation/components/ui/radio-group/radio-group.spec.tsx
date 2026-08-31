import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupItem } from './radio-group';

function TestRadioGroup({
  onValueChange,
  defaultValue,
}: {
  onValueChange?: (v: string) => void;
  defaultValue?: string;
}) {
  return (
    <RadioGroup onValueChange={onValueChange} defaultValue={defaultValue}>
      <RadioGroupItem value="a" id="opt-a" />
      <RadioGroupItem value="b" id="opt-b" />
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('renders radio items', () => {
    render(<TestRadioGroup />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
  });

  it('fires onValueChange when an item is clicked', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<TestRadioGroup onValueChange={onValueChange} />);
    await user.click(screen.getAllByRole('radio')[1]);
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('marks the default value as checked', () => {
    render(<TestRadioGroup defaultValue="a" />);
    expect(screen.getAllByRole('radio')[0]).toHaveAttribute('aria-checked', 'true');
  });

  it('is disabled when disabled prop is passed', () => {
    render(
      <RadioGroup disabled>
        <RadioGroupItem value="a" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('accepts additional className on RadioGroupItem', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" className="custom-class" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio')).toHaveClass('custom-class');
  });
});
