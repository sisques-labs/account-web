import { render, screen } from '@testing-library/react';
import { Divider } from './divider';

describe('Divider', () => {
  it('renders a separator element by default', () => {
    render(<Divider />);
    const el = document.querySelector('hr') ?? screen.queryByRole('separator');
    expect(el).toBeInTheDocument();
  });

  it('renders label text centered in divider', () => {
    render(<Divider label="OR" />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('vertical orientation applies CVA vertical class', () => {
    const { container } = render(<Divider orientation="vertical" />);
    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('merges className prop', () => {
    const { container } = render(<Divider className="my-4" />);
    expect(container.firstChild).toHaveClass('my-4');
  });
});
