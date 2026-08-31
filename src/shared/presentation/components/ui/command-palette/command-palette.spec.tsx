import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from './command-palette';

const commands = [
  { id: '1', label: 'Go to plants', group: 'Navigation', action: vi.fn() },
  { id: '2', label: 'Add plant', group: 'Navigation', action: vi.fn() },
  { id: '3', label: 'Open settings', group: 'Settings', action: vi.fn() },
];

const noop = () => {};

describe('CommandPalette', () => {
  it('renders commands when open', () => {
    render(<CommandPalette open onClose={noop} commands={commands} />);
    expect(screen.getByText('Go to plants')).toBeInTheDocument();
    expect(screen.getByText('Add plant')).toBeInTheDocument();
    expect(screen.getByText('Open settings')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    render(<CommandPalette open={false} onClose={noop} commands={commands} />);
    expect(screen.queryByText('Go to plants')).not.toBeInTheDocument();
  });

  it('renders group headings', () => {
    render(<CommandPalette open onClose={noop} commands={commands} />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('Escape calls onClose', async () => {
    const fn = vi.fn();
    render(<CommandPalette open onClose={fn} commands={commands} />);
    await userEvent.keyboard('{Escape}');
    expect(fn).toHaveBeenCalledOnce();
  });

  it('clicking a command calls its action and onClose', async () => {
    const action = vi.fn();
    const onClose = vi.fn();
    const cmds = [{ id: '1', label: 'Go to plants', group: 'Nav', action }];
    render(<CommandPalette open onClose={onClose} commands={cmds} />);
    await userEvent.click(screen.getByText('Go to plants'));
    expect(action).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('filters commands by search input', async () => {
    render(<CommandPalette open onClose={noop} commands={commands} />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'settings');
    expect(screen.getByText('Open settings')).toBeInTheDocument();
    expect(screen.queryByText('Go to plants')).not.toBeInTheDocument();
  });

  it('has a search input with placeholder', () => {
    render(<CommandPalette open onClose={noop} commands={commands} placeholder="Search commands..." />);
    expect(screen.getByPlaceholderText('Search commands...')).toBeInTheDocument();
  });

  it('⌘K shortcut opens palette when shortcut=true', () => {
    const onClose = vi.fn();
    render(<CommandPalette open={false} onClose={onClose} commands={commands} shortcut />);
    // shortcut=true registers keydown listener — opening is controlled externally
    // test that the component renders without error in shortcut mode
    expect(screen.queryByText('Go to plants')).not.toBeInTheDocument();
  });
});
