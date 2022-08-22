import { ChangeEvent, RefObject, useEffect, useState } from 'react';
import { fromEvent, map } from 'rxjs';
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
  const [inputRefElement, setInputElement] = useState(() => (
    inputRef?.current ?? (isBrowser() ? window.document.getElementById(inputId ?? '') : null)
  ));
  const [value, setValue] = useState<string>();

  useEffect(() => {
    if (!inputRefElement) return () => {};

    const subscription = fromEvent<ChangeEvent<HTMLInputElement>>(inputRefElement, 'input')
      .pipe(
        debounceTime(debounceMs ?? 500),
        map((event: ChangeEvent<HTMLInputElement>) => event?.target?.value),
      )
      .subscribe((val) => {
        setValue(val);
      });

    return () => {
      subscription?.unsubscribe();
    };
  }, [inputRefElement]);

  useEffect(() => {
    if (isBrowser()) {
      setInputElement(inputRef?.current ?? window.document.getElementById(inputId ?? ''));
    }
  });

  return value;
}
