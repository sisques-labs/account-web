import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

function TestSelect({
  onValueChange,
  defaultValue,
}: {
  onValueChange?: (v: string) => void;
  defaultValue?: string;
}) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectTrigger>
        <SelectValue placeholder="Pick one" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe('Select', () => {
  it('renders the trigger', () => {
    render(<TestSelect />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('opens the listbox when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<TestSelect />);
    await user.click(screen.getByRole('combobox'));
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  it('calls onValueChange with the selected value', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<TestSelect onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    await waitFor(() => screen.getByRole('listbox'));
    await user.click(screen.getByRole('option', { name: 'Banana' }));
    expect(onValueChange).toHaveBeenCalledWith('banana');
  });

  it('shows the selected value in the trigger', async () => {
    render(<TestSelect defaultValue="apple" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
  });

  it('renders trigger as disabled when disabled prop is passed', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('accepts className on the trigger', () => {
    render(
      <Select>
        <SelectTrigger className="custom-class">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveClass('custom-class');
  });
});
