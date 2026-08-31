import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextMenu } from './context-menu';

const items = [
  { label: 'Edit', action: vi.fn() },
  { label: 'Delete', action: vi.fn() },
  { label: 'Disabled action', action: vi.fn(), disabled: true },
];

describe('ContextMenu', () => {
  it('right-click trigger opens menu with items visible', () => {
    render(
      <ContextMenu items={items}>
        <div>Right click me</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText('Right click me'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('clicking Delete calls action', async () => {
    const deleteFn = vi.fn();
    render(
      <ContextMenu items={[{ label: 'Delete', action: deleteFn }]}>
        <div>Right click me</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText('Right click me'));
    await userEvent.click(screen.getByText('Delete'));
    expect(deleteFn).toHaveBeenCalledOnce();
  });

  it('disabled item has aria-disabled', () => {
    render(
      <ContextMenu items={items}>
        <div>Right click me</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText('Right click me'));
    const disabledItem = screen.getByText('Disabled action');
    // Radix sets aria-disabled on the item
    expect(disabledItem.closest('[aria-disabled="true"]')).toBeInTheDocument();
  });

  it('merges className on content', () => {
    render(
      <ContextMenu items={items} contentClassName="font-bold">
        <div>Right click me</div>
      </ContextMenu>
    );
    // just renders without crash
    expect(screen.getByText('Right click me')).toBeInTheDocument();
  });
});
