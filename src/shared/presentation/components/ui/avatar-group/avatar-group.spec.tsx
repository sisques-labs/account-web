import { render, screen } from '@testing-library/react';
import { AvatarGroup } from './avatar-group';

const items = [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Carol' },
  { name: 'Dave' },
  { name: 'Eve' },
  { name: 'Frank' },
];

describe('AvatarGroup', () => {
  it('renders up to max avatars with overflow chip', () => {
    const { container } = render(<AvatarGroup items={items} max={4} />);
    // 4 initials avatars + 1 overflow badge
    const avatarSpans = container.querySelectorAll('span[aria-label]');
    expect(avatarSpans).toHaveLength(4);
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('renders no overflow chip when items <= max', () => {
    render(<AvatarGroup items={[{ name: 'Ana' }, { name: 'Bob' }, { name: 'Carol' }]} max={4} />);
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it('each avatar has aria-label equal to item name', () => {
    render(<AvatarGroup items={[{ name: 'Maria' }]} max={4} />);
    expect(screen.getByLabelText('Maria')).toBeInTheDocument();
  });

  it('merges className prop', () => {
    const { container } = render(<AvatarGroup items={[{ name: 'A' }]} className="flex-row" />);
    expect(container.firstChild).toHaveClass('flex-row');
  });
});
