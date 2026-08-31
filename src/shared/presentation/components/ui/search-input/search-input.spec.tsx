import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './search-input';

describe('SearchInput', () => {
  it('renders a lucide Search icon', () => {
    const { container } = render(<SearchInput placeholder="Search" />);
    // lucide renders as svg
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('shows clear button when value is provided and clicking calls onClear', async () => {
    const onClear = vi.fn();
    render(<SearchInput value="hello" onClear={onClear} onChange={() => {}} />);
    const clearBtn = screen.getByLabelText('Clear search');
    expect(clearBtn).toBeInTheDocument();
    await userEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('does not show clear button when value is empty', () => {
    render(<SearchInput value="" onClear={() => {}} onChange={() => {}} />);
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('forwards ref to underlying input element', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement | null>;
    render(<SearchInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('spreads remaining InputHTMLAttributes through', () => {
    render(<SearchInput placeholder="Type here" data-testid="s-input" />);
    expect(screen.getByTestId('s-input')).toBeInTheDocument();
  });
});
