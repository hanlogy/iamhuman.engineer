'use client';

import { useEffect, useRef, useState } from 'react';
import { clsx } from '@hanlogy/react-web-ui';
import { getArtifactTags } from '@/actions/artifacts/getArtifactTags';
import {
  errorClass,
  helperClass,
  inputClass,
  labelClass,
} from '@/components/form/common';
import { useAppContext } from '@/state/hooks';

export function TagsField({
  label,
  helper,
  error,
  value,
  onChange,
}: {
  label?: string;
  helper?: string;
  error?: string;
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const { user } = useAppContext();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.userId) {
      return;
    }
    const fetch = async () => {
      const result = await getArtifactTags({ userId: user.userId });
      if (result.success) {
        setSuggestions(result.data.map((t) => t.label));
      }
    };
    void fetch();
  }, [user?.userId]);

  const addChip = (text: string) => {
    const trimmed = text.trim();
    setInputValue('');
    setIsOpen(false);
    if (!trimmed || value.includes(trimmed)) {
      return;
    }
    onChange([...value, trimmed]);
  };

  const editChip = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    setInputValue(value[index] ?? '');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const filteredSuggestions = inputValue.trim()
    ? suggestions.filter(
        (s) =>
          s.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.includes(s)
      )
    : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChip(
        isOpen && filteredSuggestions.length > 0
          ? (filteredSuggestions[0] ?? '')
          : inputValue
      );
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      editChip(value.length - 1);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v.endsWith(',')) {
      addChip(v.slice(0, -1));
    } else {
      setInputValue(v);
      setIsOpen(v.trim().length > 0);
    }
  };

  return (
    <div>
      {label && (
        <label className={clsx(labelClass, 'mb-1 block text-sm')}>
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={clsx(
            inputClass({ isError: Boolean(error) }),
            'flex min-h-14 cursor-text flex-wrap items-center gap-1.5 overflow-y-auto px-3 py-2'
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {value.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                editChip(i);
              }}
              className="bg-accent/10 text-accent flex items-center rounded-full px-2.5 py-0.5 text-sm"
            >
              {chip}
            </button>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue.trim()) setIsOpen(true);
            }}
            onBlur={() => {
              setIsOpen(false);
              if (inputValue.trim()) addChip(inputValue);
            }}
            className="min-w-20 flex-1 bg-transparent text-sm outline-none"
            placeholder={
              value.length === 0 ? 'Type and press Enter or , to add' : ''
            }
          />
        </div>
        {isOpen && filteredSuggestions.length > 0 && (
          <div className="bg-surface border-border absolute z-10 mt-1 w-full overflow-hidden rounded-xl border shadow-lg">
            {filteredSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addChip(s);
                }}
                className="hover:bg-surface-secondary w-full px-3 py-2 text-left text-sm"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      {helper && !error && (
        <p className={clsx(helperClass, 'mt-1 text-sm')}>{helper}</p>
      )}
      {error && <p className={clsx(errorClass, 'mt-1 text-sm')}>{error}</p>}
    </div>
  );
}
