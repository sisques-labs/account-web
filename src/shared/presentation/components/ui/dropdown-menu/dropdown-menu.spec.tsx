import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './dropdown-menu';

describe('DropdownMenu', () => {
  function renderDropdown(onSelect?: () => void) {
    return render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={onSelect}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
  }

  it('trigger is visible', () => {
    renderDropdown();
    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  it('clicking trigger opens menu and shows items', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByText('Open Menu'));

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
  });

  it('clicking an item calls onSelect', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderDropdown(onSelect);

    await user.click(screen.getByText('Open Menu'));
    await waitFor(() => screen.getByText('Edit'));
    await user.click(screen.getByText('Edit'));

    expect(onSelect).toHaveBeenCalled();
  });

  it('Escape closes the menu', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByText('Open Menu'));
    await waitFor(() => screen.getByText('Edit'));
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
  });

  it('renders menu items with correct roles', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByText('Open Menu'));
    await waitFor(() => screen.getByText('Edit'));

    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Edit');
    expect(items[1]).toHaveTextContent('Delete');
  });
});
