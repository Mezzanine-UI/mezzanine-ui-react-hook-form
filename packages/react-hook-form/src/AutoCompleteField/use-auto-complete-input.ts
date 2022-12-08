import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { debounceTime, fromEvent, map, tap } from 'rxjs';

type UseAutoCompleteInputPrams = {
  debounceMs?: number;
};

export function useAutoCompleteInput(props?: UseAutoCompleteInputPrams) {
  const { debounceMs = 900 } = props || {};
  const [input, setInput] = useState<string>('');
  const [inputEle, setInputEle] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!debounceMs || !inputEle) return () => {};

    const subscription = fromEvent<ChangeEvent<HTMLInputElement>>(inputEle, 'input')
      .pipe(
        debounceTime(debounceMs ?? 500),
        map((e) => e.target.value),
        tap((value) => setInput(value)),
      ).subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [inputEle]);

  const onInput: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    if (!inputEle || e.nativeEvent.srcElement !== inputEle) {
      setInputEle(e.nativeEvent.srcElement as HTMLInputElement);
      setInput(e.target.value);
    }
  }, [inputEle, setInputEle, setInput]);

  return {
    input,
    onInput,
  };
}
