import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders with no variant (backward-compat — default maps to neutral)', () => {
    render(<Badge>Tag</Badge>);
    expect(screen.getByText('Tag')).toBeInTheDocument();
  });

  // Gardenia variants
  it('variant="forest" applies forest token class', () => {
    const { container } = render(<Badge variant="forest">Forest</Badge>);
    expect(container.firstChild).toHaveClass('forest');
  });

  it('variant="honey" applies honey token class', () => {
    const { container } = render(<Badge variant="honey">Honey</Badge>);
    expect(container.firstChild).toHaveClass('honey');
  });

  it('variant="terra" applies terra token class', () => {
    const { container } = render(<Badge variant="terra">Terra</Badge>);
    expect(container.firstChild).toHaveClass('terra');
  });

  it('variant="sage" applies sage token class', () => {
    const { container } = render(<Badge variant="sage">Sage</Badge>);
    expect(container.firstChild).toHaveClass('sage');
  });

  it('variant="outline" applies outline token class', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    expect(container.firstChild).toHaveClass('chip');
    expect(container.firstChild).toHaveClass('outline');
  });

  it('variant="neutral" renders without error', () => {
    render(<Badge variant="neutral">Neutral</Badge>);
    expect(screen.getByText('Neutral')).toBeInTheDocument();
  });

  // Legacy backward-compat aliases
  it('legacy variant="default" still renders without TypeScript error', () => {
    render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('legacy variant="secondary" still renders without TypeScript error', () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

  it('legacy variant="destructive" still renders without TypeScript error', () => {
    render(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(<Badge className="my-custom">Custom</Badge>);
    expect(container.firstChild).toHaveClass('my-custom');
  });
});
