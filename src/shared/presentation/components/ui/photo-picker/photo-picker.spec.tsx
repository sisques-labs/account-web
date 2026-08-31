import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhotoPicker } from './photo-picker';

const photos = [
  { src: '/a.jpg', alt: 'A' },
  { src: '/b.jpg', alt: 'B' },
];

describe('PhotoPicker', () => {
  it('clicking first photo calls onSelectionChange with [0]', async () => {
    const fn = vi.fn();
    render(<PhotoPicker photos={photos} onSelectionChange={fn} />);
    await userEvent.click(screen.getAllByRole('img')[0]);
    expect(fn).toHaveBeenCalledWith([0]);
  });

  it('single mode: clicking photo 1 after photo 0 replaces selection', async () => {
    const fn = vi.fn();
    render(<PhotoPicker photos={photos} mode="single" onSelectionChange={fn} />);
    await userEvent.click(screen.getAllByRole('img')[0]);
    await userEvent.click(screen.getAllByRole('img')[1]);
    const lastCall = fn.mock.calls[fn.mock.calls.length - 1][0];
    expect(lastCall).toEqual([1]);
  });

  it('selected photo has selection indicator class', () => {
    render(<PhotoPicker photos={[{ src: '/a.jpg', alt: 'A' }]} selected={[0]} />);
    const wrapper = screen.getByRole('img').closest('[data-selected]');
    expect(wrapper).toBeInTheDocument();
  });

  it('merges className prop', () => {
    const { container } = render(<PhotoPicker photos={photos} className="gap-2" />);
    expect(container.firstChild).toHaveClass('gap-2');
  });

  it('each photo tile is a focusable button for keyboard/screen-reader users', () => {
    render(<PhotoPicker photos={photos} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('pressing Enter on a photo tile toggles selection', async () => {
    const fn = vi.fn();
    render(<PhotoPicker photos={photos} onSelectionChange={fn} />);
    screen.getAllByRole('button')[0].focus();
    await userEvent.keyboard('{Enter}');
    expect(fn).toHaveBeenCalledWith([0]);
  });
});
