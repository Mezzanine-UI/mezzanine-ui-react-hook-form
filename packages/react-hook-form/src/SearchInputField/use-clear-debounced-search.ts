import { useRef } from 'react';
import { isBrowser } from '../utils/type-checker';

interface UseClearDebouncedSearch {
  registerName: string;
  setValue: (name: any, value: any) => void;
}

export function useClearDebouncedSearch({
  registerName,
  setValue,
}: UseClearDebouncedSearch) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onClear = () => {
    if (!isBrowser()) return;

    if (!inputRef.current) {
      inputRef.current = window.document.getElementById(registerName) as HTMLInputElement || null;
    }

    const target = inputRef.current;

    if (!target) return;

    target.setAttribute('value', '');
    target.value = '';
    setValue(registerName, '');
  };

  return onClear;
}
