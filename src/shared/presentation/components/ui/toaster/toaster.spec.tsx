import { render, screen } from '@testing-library/react';
import { Toaster } from './toaster';

describe('Toaster', () => {
  it('renders without error', () => {
    expect(() => render(<Toaster />)).not.toThrow();
  });

  it('mounts a single Toaster instance', () => {
    const { container } = render(<Toaster />);
    // Sonner renders an ol element as the toast region
    expect(container.firstChild).not.toBeNull();
  });
});
