import { ChangeEvent, RefObject, useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { fromEvent, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, repeatWhen, share, takeUntil, tap } from 'rxjs/operators';
import { isBrowser } from '../utils/type-checker';

export interface UseDebouncedValue {
  cancel$?: Subject<void>;
  debounceMs?: number;
  inputId?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function useDebouncedValue({
  debounceMs,
  inputId,
  inputRef,
  cancel$,
  onChange,
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

    const input$ = fromEvent<ChangeEvent<HTMLInputElement>>(inputRefElement, 'input');
    const subscription = input$
      .pipe(
        share(),
        takeUntil(cancel$ || of(null)),
        repeatWhen(() => input$),
        debounceTime(debounceMs ?? 500),
        distinctUntilChanged(),
        tap((e) => {
          onChange?.(e);
          setDebouncedValue(e.target.value);
        }),
      )
      .subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  }, [inputRefElement, onChange]);

  useEffect(() => {
    if (!value) {
      setDebouncedValue(value);
    }
  }, [value]);

  return debouncedValue;
}
