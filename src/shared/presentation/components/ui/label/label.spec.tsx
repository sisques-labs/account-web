import { render, screen } from '@testing-library/react';
import { Label } from './label';

describe('Label', () => {
  it('renders children', () => {
    render(<Label>Email address</Label>);
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  it('associates with an input via htmlFor', () => {
    render(
      <div>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </div>,
    );
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email');
  });

  it('forwards ref to the underlying element', () => {
    const ref = { current: null };
    render(<Label ref={ref}>Ref label</Label>);
    expect(ref.current).not.toBeNull();
  });

  it('accepts additional className', () => {
    render(<Label className="custom-class">Styled</Label>);
    expect(screen.getByText('Styled')).toHaveClass('custom-class');
  });
});
