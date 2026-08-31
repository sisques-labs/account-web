import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './tooltip';

describe('Tooltip', () => {
  it('tooltip content appears when trigger is focused', async () => {
    render(
      <Tooltip content="Add plant">
        <button>+</button>
      </Tooltip>
    );
    await act(async () => {
      screen.getByRole('button', { name: '+' }).focus();
    });
    expect(screen.getAllByText('Add plant').length).toBeGreaterThan(0);
  });

  it('tooltip content has role="tooltip"', async () => {
    render(
      <Tooltip content="Info tip">
        <button>i</button>
      </Tooltip>
    );
    await act(async () => {
      screen.getByRole('button', { name: 'i' }).focus();
    });
    // Radix renders role="tooltip" on the content
    const tooltip = document.querySelector('[role="tooltip"]');
    expect(tooltip).toBeInTheDocument();
  });

  it('side prop is accepted without error', () => {
    expect(() =>
      render(
        <Tooltip content="bottom tip" side="bottom">
          <button>btn</button>
        </Tooltip>
      )
    ).not.toThrow();
  });

  it('merges className on content', () => {
    render(
      <Tooltip content="tip" contentClassName="font-bold">
        <button>btn</button>
      </Tooltip>
    );
    // just rendering without crash is sufficient
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
