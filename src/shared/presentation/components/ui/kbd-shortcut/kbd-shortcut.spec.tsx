import { render, screen } from '@testing-library/react';
import { KbdShortcut } from './kbd-shortcut';

describe('KbdShortcut', () => {
  it('renders two kbd elements for two keys', () => {
    render(<KbdShortcut keys={['⌘', 'K']} />);
    expect(document.querySelectorAll('kbd')).toHaveLength(2);
  });

  it('renders separator between keys', () => {
    render(<KbdShortcut keys={['Ctrl', 'S']} separator="+" />);
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('single key renders without separator', () => {
    render(<KbdShortcut keys={['Escape']} />);
    expect(document.querySelectorAll('kbd')).toHaveLength(1);
    expect(document.querySelectorAll('[data-separator]')).toHaveLength(0);
  });

  it('merges className prop', () => {
    const { container } = render(<KbdShortcut keys={['A']} className="ml-2" />);
    expect(container.firstChild).toHaveClass('ml-2');
  });
});
