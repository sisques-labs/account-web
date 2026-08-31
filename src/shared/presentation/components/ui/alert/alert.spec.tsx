import { render, screen } from '@testing-library/react';
import { Alert } from './alert';

describe('Alert', () => {
  it('has role="alert"', () => {
    render(<Alert variant="info" message="Informational message" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders message text', () => {
    render(<Alert variant="error" message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Alert variant="info" title="Notice" message="Please read this." />);
    expect(screen.getByText('Notice')).toBeInTheDocument();
    expect(screen.getByText('Please read this.')).toBeInTheDocument();
  });

  it('error variant uses destructive token class', () => {
    render(<Alert variant="error" message="Error" />);
    const alert = screen.getByRole('alert');
    expect(alert.className).toMatch(/destructive|terracotta|error/);
  });

  it('warning variant uses warning/honey token class', () => {
    render(<Alert variant="warning" message="Warning" />);
    const alert = screen.getByRole('alert');
    expect(alert.className).toMatch(/warning|honey/);
  });

  it('info variant uses accent/forest token class', () => {
    render(<Alert variant="info" message="Info" />);
    const alert = screen.getByRole('alert');
    expect(alert.className).toMatch(/accent|forest|info/);
  });

  it('success variant renders without error', () => {
    render(<Alert variant="success" message="Saved!" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Saved!')).toBeInTheDocument();
  });

  it('renders an icon element per variant', () => {
    const { container } = render(<Alert variant="error" message="Error" />);
    // Lucide icons render as svg elements
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
