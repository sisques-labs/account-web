import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from './combobox';

const options = [
  { value: 'rose', label: 'Rose' },
  { value: 'fern', label: 'Fern' },
];

describe('Combobox', () => {
  it('filters options by typed input', async () => {
    render(<Combobox options={options} />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'ro');
    expect(screen.getByText('Rose')).toBeInTheDocument();
    expect(screen.queryByText('Fern')).not.toBeInTheDocument();
  });

  it('clicking an option calls onChange with its value', async () => {
    const fn = vi.fn();
    render(<Combobox options={options} onChange={fn} />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    const fernItem = await screen.findByText('Fern');
    await userEvent.click(fernItem);
    expect(fn).toHaveBeenCalledWith('fern');
  });

  it('Escape hides the option list', async () => {
    render(<Combobox options={options} />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    expect(screen.getByText('Rose')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText('Rose')).not.toBeInTheDocument();
  });

  it('merges className prop', () => {
    const { container } = render(<Combobox options={options} className="w-64" />);
    expect(container.firstChild).toHaveClass('w-64');
  });
});
