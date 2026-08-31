import { render, screen } from '@testing-library/react';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('forwards ref to the underlying textarea element', () => {
    const ref = { current: null };
    render(<Textarea ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect((ref.current as HTMLElement | null)?.tagName).toBe('TEXTAREA');
  });

  it('sets disabled attribute when disabled prop is passed', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('accepts additional className', () => {
    render(<Textarea className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('accepts placeholder text', () => {
    render(<Textarea placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  it('supports readOnly state', () => {
    render(<Textarea readOnly value="read only content" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });

  it('forwards rows prop to the underlying textarea', () => {
    render(<Textarea rows={4} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
  });
});
