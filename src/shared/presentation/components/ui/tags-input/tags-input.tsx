'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface TagsInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  ref?: React.Ref<HTMLDivElement>;
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
}

const TagsInput = ({ className, value, defaultValue, onChange, placeholder = 'Add tag…', ref, ...props }: TagsInputProps) => {
  const isControlled = value !== undefined;
  const [internalTags, setInternalTags] = React.useState<string[]>(defaultValue ?? []);
  const [inputValue, setInputValue] = React.useState('');

  const tags = isControlled ? value : internalTags;

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/,$/, '');
    if (!tag || tags.includes(tag)) return;
    const next = [...tags, tag];
    if (!isControlled) setInternalTags(next);
    onChange?.(next);
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    const next = tags.filter((t) => t !== tagToRemove);
    if (!isControlled) setInternalTags(next);
    onChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(',')) {
      addTag(val);
    } else {
      setInputValue(val);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-wrap gap-1.5 items-center rounded-md border border-[var(--rule)] bg-[var(--paper-2)] px-3 py-2 text-sm min-h-[36px]',
        className,
      )}
      {...props}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="chip inline-flex items-center gap-1"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => removeTag(tag)}
            className="ml-0.5 rounded hover:text-[var(--ink)]"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[80px] outline-none bg-transparent text-sm"
      />
    </div>
  );
};

TagsInput.displayName = 'TagsInput';

export { TagsInput };
