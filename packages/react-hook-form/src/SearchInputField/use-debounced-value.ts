import { ChangeEvent, RefObject, useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { isBrowser } from '../utils/type-checker';

export interface UseDebouncedValue {
  debounceMs?: number;
  inputId?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export function useDebouncedValue({
  debounceMs,
  inputId,
  inputRef,
}: UseDebouncedValue) {
  const value = useWatch({ name: inputId || '' });
  const [debouncedValue, setDebouncedValue] = useState(value);

  const [inputRefElement, setInputElement] = useState(() => (
    inputRef?.current ?? (isBrowser() ? window.document.getElementById(inputId ?? '') : null)
  ));

  useEffect(() => {
    if (isBrowser()) {
      setInputElement(inputRef?.current ?? window.document.getElementById(inputId ?? ''));
    }
  });

  useEffect(() => {
    if (!inputRefElement) return () => {};

    const subscription = fromEvent<ChangeEvent<HTMLInputElement>>(inputRefElement, 'input')
      .pipe(debounceTime(debounceMs ?? 500))
      .subscribe((e) => setDebouncedValue(e.target.value));

    return () => {
      subscription?.unsubscribe();
    };
  }, [inputRefElement]);

  useEffect(() => {
    if (!value) {
      setDebouncedValue(value);
    }
  }, [value]);

  return debouncedValue;
}
