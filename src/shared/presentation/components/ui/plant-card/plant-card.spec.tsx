import { render, screen } from '@testing-library/react';
import { PlantCard } from './plant-card';

describe('PlantCard', () => {
  it('renders plant name and species', () => {
    render(<PlantCard name="Monstera" species="M. deliciosa" />);
    expect(screen.getByText('Monstera')).toBeInTheDocument();
    expect(screen.getByText('M. deliciosa')).toBeInTheDocument();
  });

  it('renders a chip element with status text', () => {
    render(<PlantCard name="Fern" status="healthy" />);
    expect(screen.getByText('healthy')).toBeInTheDocument();
  });

  it('does not render img element when no imageUrl provided', () => {
    const { container } = render(<PlantCard name="Rose" />);
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('merges className prop', () => {
    const { container } = render(<PlantCard name="Cactus" className="w-64" />);
    expect(container.firstChild).toHaveClass('w-64');
  });
});
