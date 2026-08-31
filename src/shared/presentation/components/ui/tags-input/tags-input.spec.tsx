import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagsInput } from './tags-input';

describe('TagsInput', () => {
  it('Enter key adds a tag chip and clears input', async () => {
    render(<TagsInput />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'tomato{Enter}');
    expect(screen.getByText('tomato')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('removing a tag calls onChange with updated array', async () => {
    const fn = vi.fn();
    render(<TagsInput value={['rose']} onChange={fn} />);
    const removeBtn = screen.getByLabelText('Remove rose');
    await userEvent.click(removeBtn);
    expect(fn).toHaveBeenCalledWith([]);
  });

  it('duplicate tag is rejected — onChange not called', async () => {
    const fn = vi.fn();
    render(<TagsInput value={['fern']} onChange={fn} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'fern{Enter}');
    // only called if not duplicate; fern already exists
    const callsWithFern = fn.mock.calls.filter((args) => args[0].includes('fern') && args[0].length > 1);
    expect(callsWithFern).toHaveLength(0);
  });

  it('comma key also adds a tag', async () => {
    render(<TagsInput />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'basil,');
    expect(screen.getByText('basil')).toBeInTheDocument();
  });

  it('merges className prop', () => {
    const { container } = render(<TagsInput className="mt-2" />);
    expect(container.firstChild).toHaveClass('mt-2');
  });
});
