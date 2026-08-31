import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from './file-upload';

function createFile(name: string, sizeMB: number): File {
  const content = 'x'.repeat(sizeMB * 1024 * 1024);
  return new File([content], name, { type: 'image/jpeg' });
}

describe('FileUpload', () => {
  it('valid file selection calls onChange with file array', () => {
    const fn = vi.fn();
    const { container } = render(<FileUpload onChange={fn} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createFile('test.jpg', 0.1);
    fireEvent.change(input, { target: { files: [file] } });
    expect(fn).toHaveBeenCalledWith([file]);
  });

  it('file exceeding maxSizeMB shows error message', () => {
    const { container } = render(<FileUpload maxSizeMB={1} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const bigFile = createFile('big.jpg', 5);
    fireEvent.change(input, { target: { files: [bigFile] } });
    expect(screen.getByText(/too large|size|5/i)).toBeInTheDocument();
  });

  it('multiple selection calls onChange with array of 2', () => {
    const fn = vi.fn();
    const { container } = render(<FileUpload multiple onChange={fn} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const f1 = createFile('a.jpg', 0.1);
    const f2 = createFile('b.jpg', 0.1);
    fireEvent.change(input, { target: { files: [f1, f2] } });
    expect(fn).toHaveBeenCalledWith([f1, f2]);
  });

  it('merges className prop', () => {
    const { container } = render(<FileUpload className="border-2" />);
    expect(container.firstChild).toHaveClass('border-2');
  });

  it('drop zone exposes an interactive role for keyboard/screen-reader users', () => {
    const { container } = render(<FileUpload />);
    expect(container.firstChild).toHaveAttribute('role', 'button');
    expect(container.firstChild).toHaveAttribute('tabindex', '0');
  });

  it('file input has an accessible label', () => {
    const { container } = render(<FileUpload />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAccessibleName();
  });
});
