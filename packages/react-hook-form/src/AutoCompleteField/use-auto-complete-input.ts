import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { debounceTime, distinctUntilChanged, fromEvent, share, tap } from 'rxjs';

type UseAutoCompleteInputPrams = {
  debounceMs?: number;
};

export function useAutoCompleteInput(props?: UseAutoCompleteInputPrams) {
  const { debounceMs = 900 } = props || {};
  const [input, setInput] = useState<string>('');
  const [inputEle, setInputEle] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!debounceMs || !inputEle) return () => {};

    const input$ = fromEvent<ChangeEvent<HTMLInputElement>>(inputEle, 'input');
    const subscription = input$
      .pipe(
        share(),
        debounceTime(debounceMs ?? 500),
        distinctUntilChanged(),
        tap((e) => setInput(e.target.value)),
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
