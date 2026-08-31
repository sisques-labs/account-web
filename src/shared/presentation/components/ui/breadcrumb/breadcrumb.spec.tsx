import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

describe('Breadcrumb', () => {
  function renderBreadcrumb() {
    return render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Plants</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
  }

  it('renders a nav element with aria-label="breadcrumb"', () => {
    renderBreadcrumb();
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
  });

  it('renders items with href as anchor links', () => {
    renderBreadcrumb();
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('last item has aria-current="page"', () => {
    renderBreadcrumb();
    expect(screen.getByText('Plants')).toHaveAttribute('aria-current', 'page');
  });

  it('current page item does not fake a link role', () => {
    renderBreadcrumb();
    expect(screen.getByText('Plants')).not.toHaveAttribute('role', 'link');
  });

  it('renders separator between items', () => {
    const { container } = renderBreadcrumb();
    const separator = container.querySelector('[aria-hidden="true"]');
    expect(separator).toBeInTheDocument();
  });

  it('separator has ink-3 color class', () => {
    const { container } = renderBreadcrumb();
    const separator = container.querySelector('[aria-hidden="true"]');
    expect(separator).toHaveClass('text-[var(--ink-3)]');
  });
});
