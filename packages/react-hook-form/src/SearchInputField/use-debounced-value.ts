import { ChangeEvent, RefObject, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { isBrowser } from '../utils/type-checker';

export interface UseDebouncedValue {
  debounceMs?: number;
  inputId?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  stopSubject$?: Subject<void>;
}

export function useDebouncedValue({
  debounceMs,
  inputId,
  inputRef,
}: UseDebouncedValue) {
  const { setValue } = useFormContext();
  const value = useWatch({ name: inputId || '' });

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
      .subscribe((e) => {
        setValue(inputId ?? '', e.target.value);
      });

    return () => {
      subscription?.unsubscribe();
    };
  }, [inputRefElement, setValue]);

  return value;
}
