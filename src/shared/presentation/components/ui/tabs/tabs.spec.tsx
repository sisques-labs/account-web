import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

describe('Tabs', () => {
  function renderTabs(variant?: 'line' | 'pill', onValueChange?: (v: string) => void) {
    return render(
      <Tabs defaultValue="plants" onValueChange={onValueChange}>
        <TabsList variant={variant}>
          <TabsTrigger value="plants">Plants</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="plants">Plants panel</TabsContent>
        <TabsContent value="history">History panel</TabsContent>
      </Tabs>,
    );
  }

  it('renders tabs with default tab panel visible', () => {
    renderTabs();
    expect(screen.getByText('Plants panel')).toBeInTheDocument();
  });

  it('clicking a tab makes its panel visible and calls onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderTabs(undefined, onValueChange);

    await user.click(screen.getByRole('tab', { name: 'History' }));

    expect(onValueChange).toHaveBeenCalledWith('history');
    expect(screen.getByText('History panel')).toBeInTheDocument();
  });

  it('pill variant applies pill class on TabsList', () => {
    const { container } = renderTabs('pill');
    const list = container.querySelector('[role="tablist"]');
    expect(list).toHaveClass('pill');
    expect(list).not.toHaveClass('line');
  });

  it('line variant applies line class on TabsList', () => {
    const { container } = renderTabs('line');
    const list = container.querySelector('[role="tablist"]');
    expect(list).toHaveClass('line');
  });

  it('keyboard ArrowRight moves focus to next tab', async () => {
    const user = userEvent.setup();
    renderTabs();

    const plantsTab = screen.getByRole('tab', { name: 'Plants' });
    plantsTab.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'History' })).toHaveFocus();
  });

  it('keyboard ArrowLeft moves focus to previous tab', async () => {
    const user = userEvent.setup();
    renderTabs();

    const historyTab = screen.getByRole('tab', { name: 'History' });
    historyTab.focus();
    await user.keyboard('{ArrowLeft}');

    expect(screen.getByRole('tab', { name: 'Plants' })).toHaveFocus();
  });
});
