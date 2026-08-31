import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhotoGrid } from './photo-grid';

const photos6 = Array.from({ length: 6 }, (_, i) => ({
  src: `/photo${i}.jpg`,
  alt: `Photo ${i}`,
}));

describe('PhotoGrid', () => {
  it('renders 6 img elements for 6 photos', () => {
    render(<PhotoGrid photos={photos6} />);
    expect(screen.getAllByRole('img')).toHaveLength(6);
  });

  it('clicking second photo calls onPhotoClick with index 1', async () => {
    const fn = vi.fn();
    render(<PhotoGrid photos={photos6} onPhotoClick={fn} />);
    const imgs = screen.getAllByRole('img');
    await userEvent.click(imgs[1]);
    expect(fn).toHaveBeenCalledWith(1);
  });

  it('renders correct alt text on images', () => {
    render(<PhotoGrid photos={[{ src: '/a.jpg', alt: 'Monstera' }]} />);
    expect(screen.getByAltText('Monstera')).toBeInTheDocument();
  });

  it('merges className prop', () => {
    const { container } = render(<PhotoGrid photos={photos6} className="gap-2" />);
    expect(container.firstChild).toHaveClass('gap-2');
  });
});
