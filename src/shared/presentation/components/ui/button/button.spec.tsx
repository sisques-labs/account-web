import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[var(--terracotta)]');
  });

  describe('loading state', () => {
    it('renders a spinner when loading is true', () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByRole('button').querySelector('[aria-hidden="true"]')).toBeTruthy();
    });

    it('sets aria-disabled when loading', () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('disables pointer events when loading', () => {
      render(<Button loading>Save</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toBeDisabled();
    });

    it('keeps button text visible alongside spinner', () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('shows no spinner when loading is false', () => {
      render(<Button loading={false}>Save</Button>);
      const btn = screen.getByRole('button');
      expect(btn.querySelector('svg')).toBeNull();
    });

    it('shows no spinner without loading prop', () => {
      render(<Button>Save</Button>);
      const btn = screen.getByRole('button');
      expect(btn.querySelector('svg')).toBeNull();
    });
  });
});
