import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FacetPanel } from './facet-panel';

const facets = [
  {
    key: 'color',
    label: 'Color',
    options: [{ value: 'red', label: 'Red' }, { value: 'green', label: 'Green' }],
  },
  {
    key: 'size',
    label: 'Size',
    options: [{ value: 'small', label: 'Small' }],
  },
];

describe('FacetPanel', () => {
  it('renders 2 facet group headings', () => {
    render(<FacetPanel facets={facets} />);
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
  });

  it('checking "red" calls onChange with facet key and [red]', async () => {
    const fn = vi.fn();
    render(<FacetPanel facets={facets} onChange={fn} />);
    await userEvent.click(screen.getByLabelText('Red'));
    expect(fn).toHaveBeenCalledWith('color', ['red']);
  });

  it('pre-selected green checkbox is checked', () => {
    render(<FacetPanel facets={facets} selected={{ color: ['green'] }} />);
    expect(screen.getByLabelText('Green')).toBeChecked();
  });

  it('merges className prop', () => {
    const { container } = render(<FacetPanel facets={facets} className="w-48" />);
    expect(container.firstChild).toHaveClass('w-48');
  });
});
