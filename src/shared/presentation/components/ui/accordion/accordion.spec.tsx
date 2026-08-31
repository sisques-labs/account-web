import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './accordion';

const items = [
  { id: 'item1', title: 'Panel 1', content: <p>Content 1</p> },
  { id: 'item2', title: 'Panel 2', content: <p>Content 2</p> },
];

describe('Accordion', () => {
  it('clicking trigger reveals panel content', async () => {
    render(<Accordion items={items} />);
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Panel 1'));
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('single mode: opening item 2 collapses item 1', async () => {
    render(<Accordion items={items} mode="single" />);
    await userEvent.click(screen.getByText('Panel 1'));
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Panel 2'));
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('trigger button has aria-expanded reflecting open state', async () => {
    render(<Accordion items={items} />);
    const trigger = screen.getByRole('button', { name: 'Panel 1' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('merges className prop', () => {
    const { container } = render(<Accordion items={items} className="gap-2" />);
    expect(container.firstChild).toHaveClass('gap-2');
  });
});
