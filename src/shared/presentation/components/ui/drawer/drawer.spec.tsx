import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Drawer } from './drawer';

const noop = () => {};

describe('Drawer', () => {
  it('renders children when open', () => {
    render(<Drawer open title="Settings" onClose={noop}>Content</Drawer>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('Escape calls onClose', async () => {
    const fn = vi.fn();
    render(<Drawer open title="Settings" onClose={fn}>Content</Drawer>);
    await userEvent.keyboard('{Escape}');
    expect(fn).toHaveBeenCalledOnce();
  });

  it('dialog element has role="dialog"', () => {
    render(<Drawer open title="Settings" onClose={noop}>Body</Drawer>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('side variant data attribute applied', () => {
    render(
      <Drawer open title="T" onClose={noop} side="left">Body</Drawer>
    );
    const content = document.querySelector('[data-side="left"]');
    expect(content).toBeInTheDocument();
  });

  it('renders without error', () => {
    render(<Drawer open title="T" onClose={noop} className="max-w-sm">Body</Drawer>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
