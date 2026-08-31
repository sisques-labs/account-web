import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Lightbox } from './lightbox';

const photos = [
  { src: '/a.jpg', alt: 'A' },
  { src: '/b.jpg', alt: 'B' },
  { src: '/c.jpg', alt: 'C' },
];

describe('Lightbox', () => {
  it('renders current photo when open', () => {
    render(<Lightbox photos={[{ src: '/a.jpg', alt: 'A' }]} open onClose={() => {}} />);
    expect(screen.getByRole('img', { name: 'A' })).toBeInTheDocument();
  });

  it('Escape key calls onClose', () => {
    const fn = vi.fn();
    render(<Lightbox photos={photos} open onClose={fn} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('next button advances to second photo', async () => {
    render(<Lightbox photos={photos} open onClose={() => {}} initialIndex={0} />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'A');
    await userEvent.click(screen.getByLabelText('Next photo'));
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'B');
  });

  it('merges className prop', () => {
    const { container } = render(
      <Lightbox photos={photos} open onClose={() => {}} className="z-100" />
    );
    // className is passed to the overlay div
    expect(container.querySelector('.z-100')).toBeInTheDocument();
  });

  it('clicking the backdrop calls onClose', () => {
    const fn = vi.fn();
    const { container } = render(<Lightbox photos={photos} open onClose={fn} />);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('backdrop is marked as non-interactive for assistive tech (real dismissal is the Close button/Escape)', () => {
    const { container } = render(<Lightbox photos={photos} open onClose={() => {}} />);
    expect(container.firstChild).toHaveAttribute('role', 'presentation');
  });

  it('renders the caption when the current photo has one', () => {
    render(
      <Lightbox
        photos={[{ src: '/a.jpg', alt: 'A', caption: 'Uploaded on 12 Mar 2026' }]}
        open
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Uploaded on 12 Mar 2026')).toBeInTheDocument();
  });

  it('renders no caption text when the current photo has none', () => {
    render(<Lightbox photos={[{ src: '/a.jpg', alt: 'A' }]} open onClose={() => {}} />);
    expect(screen.queryByText(/uploaded/i)).not.toBeInTheDocument();
  });
});
