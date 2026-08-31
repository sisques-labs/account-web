import { render, screen } from '@testing-library/react';
import { Chip } from './chip';

describe('Chip', () => {
  it('applies chip class by default', () => {
    render(<Chip>Tag</Chip>);
    const chip = screen.getByText('Tag');
    expect(chip).toHaveClass('chip');
  });

  it('applies forest variant class', () => {
    render(<Chip variant="forest">Herb</Chip>);
    const chip = screen.getByText('Herb');
    expect(chip).toHaveClass('chip');
    expect(chip).toHaveClass('forest');
  });

  it('applies honey variant class', () => {
    render(<Chip variant="honey">Spice</Chip>);
    const chip = screen.getByText('Spice');
    expect(chip).toHaveClass('chip');
    expect(chip).toHaveClass('honey');
  });

  it('applies terra variant class', () => {
    render(<Chip variant="terra">Plant</Chip>);
    expect(screen.getByText('Plant')).toHaveClass('terra');
  });

  it('applies sage variant class', () => {
    render(<Chip variant="sage">Herb</Chip>);
    expect(screen.getByText('Herb')).toHaveClass('sage');
  });

  it('applies outline variant class', () => {
    render(<Chip variant="outline">Outline</Chip>);
    expect(screen.getByText('Outline')).toHaveClass('outline');
  });

  it('merges additional className', () => {
    render(<Chip className="extra-class">Tag</Chip>);
    expect(screen.getByText('Tag')).toHaveClass('extra-class');
  });

  it('default variant does not add extra variant class beyond chip', () => {
    render(<Chip variant="default">Default</Chip>);
    const chip = screen.getByText('Default');
    expect(chip).toHaveClass('chip');
    expect(chip).not.toHaveClass('forest');
    expect(chip).not.toHaveClass('honey');
  });

  it('renders as span element', () => {
    render(<Chip>Tag</Chip>);
    expect(screen.getByText('Tag').tagName.toLowerCase()).toBe('span');
  });
});
