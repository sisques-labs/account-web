import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormField } from './form-field';

describe('FormField', () => {
  it('associates the label with the control via matching htmlFor/id', () => {
    render(
      <FormField label="Username">
        <input placeholder="Type here" />
      </FormField>,
    );
    const input = screen.getByPlaceholderText('Type here');
    const label = screen.getByText('Username');
    expect(label).toHaveAttribute('for', input.id);
    expect(input.id).toBeTruthy();
  });

  it('preserves an explicit id on the control instead of overriding it', () => {
    render(
      <FormField label="Email">
        <input id="user-email" placeholder="Type here" />
      </FormField>,
    );
    const input = screen.getByPlaceholderText('Type here');
    expect(input.id).toBe('user-email');
    expect(screen.getByText('Email')).toHaveAttribute('for', 'user-email');
  });

  it('renders the error message when provided', () => {
    render(
      <FormField label="Username" error="Required">
        <input placeholder="Type here" />
      </FormField>,
    );
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
