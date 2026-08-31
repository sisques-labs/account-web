import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActiveFilterChips } from './active-filter-chips';

describe('ActiveFilterChips', () => {
  it('renders chip for each filter', () => {
    render(<ActiveFilterChips filters={[{ key: 'color', label: 'Green' }]} onRemove={() => {}} />);
    expect(screen.getByText('Green')).toBeInTheDocument();
  });

  it('remove button click calls onRemove with filter key', async () => {
    const fn = vi.fn();
    render(<ActiveFilterChips filters={[{ key: 'color', label: 'Green' }]} onRemove={fn} />);
    await userEvent.click(screen.getByLabelText('Remove Green'));
    expect(fn).toHaveBeenCalledWith('color');
  });

  it('renders nothing when filters is empty', () => {
    const { container } = render(<ActiveFilterChips filters={[]} onRemove={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('merges className prop', () => {
    const { container } = render(
      <ActiveFilterChips filters={[{ key: 'k', label: 'L' }]} onRemove={() => {}} className="flex-wrap" />
    );
    expect(container.firstChild).toHaveClass('flex-wrap');
  });
});
