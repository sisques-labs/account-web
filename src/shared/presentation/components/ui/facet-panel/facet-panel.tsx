import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface FacetOption {
  value: string;
  label: string;
}

export interface Facet {
  key: string;
  label: string;
  options: FacetOption[];
}

export interface FacetPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  ref?: React.Ref<HTMLDivElement>;
  facets: Facet[];
  selected?: Record<string, string[]>;
  onChange?: (key: string, values: string[]) => void;
}

const FacetPanel = ({ className, facets, selected = {}, onChange, ref, ...props }: FacetPanelProps) => {
  const handleChange = (facetKey: string, optionValue: string, checked: boolean) => {
    const current = selected[facetKey] ?? [];
    const next = checked
      ? [...current, optionValue]
      : current.filter((v) => v !== optionValue);
    onChange?.(facetKey, next);
  };

  return (
    <div ref={ref} className={cn('flex flex-col gap-4', className)} {...props}>
      {facets.map((facet) => {
        const selectedSet = new Set(selected[facet.key] ?? []);
        return (
          <div key={facet.key}>
            <h4 className="eyebrow mb-2">{facet.label}</h4>
            <ul className="flex flex-col gap-1.5">
              {facet.options.map((opt) => {
                const isChecked = selectedSet.has(opt.value);
                const id = `facet-${facet.key}-${opt.value}`;
                return (
                  <li key={opt.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={id}
                      checked={isChecked}
                      onChange={(e) => handleChange(facet.key, opt.value, e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--rule)] accent-[var(--forest)]"
                    />
                    <label htmlFor={id} className="text-sm text-[var(--ink-2)] cursor-pointer">
                      {opt.label}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

FacetPanel.displayName = 'FacetPanel';

export { FacetPanel };
