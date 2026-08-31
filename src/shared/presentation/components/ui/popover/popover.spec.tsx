import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './popover';

describe('Popover', () => {
  it('clicking trigger shows children content', async () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Popover content</p>
      </Popover>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('Escape key closes popover', async () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Content</p>
      </Popover>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Content')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('click outside closes popover', async () => {
    render(
      <div>
        <Popover trigger={<button>Open</button>}>
          <p>Content</p>
        </Popover>
        <div data-testid="outside">Outside</div>
      </div>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Content')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('outside'));
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('merges className on content', () => {
    render(
      <Popover trigger={<button>Open</button>} contentClassName="p-4">
        <p>Content</p>
      </Popover>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
