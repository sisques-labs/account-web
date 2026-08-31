import { render, screen } from '@testing-library/react';
import { Callout } from './callout';

describe('Callout', () => {
  it('renders children content', () => {
    render(<Callout>Remember to water daily</Callout>);
    expect(screen.getByText('Remember to water daily')).toBeInTheDocument();
  });

  it('variant="warning" applies CVA warning class', () => {
    const { container } = render(<Callout variant="warning">Watch out</Callout>);
    expect(container.firstChild).toHaveClass('border-[var(--honey)]');
  });

  it('title renders before children in DOM', () => {
    const { container } = render(<Callout title="Tip" variant="info">Content</Callout>);
    const title = screen.getByText('Tip');
    const content = screen.getByText('Content');
    expect(container.firstChild?.firstChild).toBeTruthy();
    expect(title.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('merges className prop', () => {
    const { container } = render(<Callout className="mt-4">body</Callout>);
    expect(container.firstChild).toHaveClass('mt-4');
  });
});
