import { SelectValue } from '@mezzanine-ui/react';
import { EventEmitter } from 'eventemitter3';
import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { debounceTime, Observable, Subscription, tap } from 'rxjs';
import { isBrowser } from '../utils/type-checker';

class AutoCompleteStore<T extends SelectValue | SelectValue[]> extends EventEmitter {
  static Events = {
    UPDATE: 'E/UPDATE',
  };

  private _observableMap: Map<string, Observable<T>> = new Map();

  add<F extends SelectValue | SelectValue[] = T>(id: string, value: F) {
    this.emit(`${AutoCompleteStore.Events.UPDATE}:${id}`, value);
  }

  watch(id: string) {
    const storedObservable = this._observableMap.get(id);

    const observable = storedObservable || new Observable<T>((subscriber) => {
      function onUpdate(nextData: T) {
        subscriber.next(nextData);
      }

      this.on(`${AutoCompleteStore.Events.UPDATE}:${id}`, onUpdate);
    });

    if (!storedObservable) {
      this._observableMap.set(id, observable);
    }

    return observable;
  }
}

let autoCompleteStore: AutoCompleteStore<SelectValue | SelectValue[]>;

interface UseAutoCompleteDebounceParams<Mode extends 'single' | 'multiple' = 'single' | 'multiple'> {
  registerName: string;
  debounceMs?: number;
  skip?: boolean;
  onChange?: Mode extends 'single' ? (value: SelectValue) => void
    : Mode extends 'multiple' ? (value: SelectValue[]) => void
      : (value: SelectValue | SelectValue[]) => void;
}

interface UseAutoCompleteMultiDebounceParams<
  Mode extends 'single' | 'multiple' = 'single' | 'multiple'> extends UseAutoCompleteDebounceParams<Mode> {
  disabledAutoClickAway?: boolean;
  autoClickAwayDebounceMs?: number;
}

export function useAutoCompleteDebounce(
  v: UseAutoCompleteDebounceParams<'single'>, mode: 'single'
): (value: SelectValue) => void;
export function useAutoCompleteDebounce(
  v: UseAutoCompleteMultiDebounceParams<'multiple'>, mode: 'multiple'
): (value: SelectValue[]) => void;
export function useAutoCompleteDebounce<
  T extends 'single' | 'multiple'>(
  v: UseAutoCompleteDebounceParams<'single'> | UseAutoCompleteMultiDebounceParams,
  mode: T
): (value: T extends 'single' ? SelectValue : SelectValue[]) => void;
export function useAutoCompleteDebounce({
  registerName,
  debounceMs = 1200,
  disabledAutoClickAway = false,
  autoClickAwayDebounceMs = 1500,
  skip = false,
  onChange: onChangeProp,
}: UseAutoCompleteMultiDebounceParams, mode: 'multiple' | 'single'): any {
  const { setValue } = useFormContext();

  useLayoutEffect(() => {
    if (typeof autoCompleteStore === 'undefined' || autoCompleteStore === undefined) {
      autoCompleteStore = new AutoCompleteStore();
    }
  }, []);

  useEffect(() => {
    if (!isBrowser()) return;

    let inputObservable = autoCompleteStore.watch(registerName);
    let clickAwaySubscription: Subscription | undefined;
    let clickObservable = new Observable<VoidFunction>((subscriber) => {
      subscriber.next();
    });

    if (!skip) {
      inputObservable = inputObservable.pipe(debounceTime(debounceMs));

      /** 如果是多選，當選完 n 秒後沒動靜，自動關掉下拉選單 */
      if (mode === 'multiple' && !disabledAutoClickAway) {
        clickObservable = clickObservable.pipe(
          debounceTime(autoClickAwayDebounceMs),
        );
      }
    }

    const inputSubscription = inputObservable.pipe(
      tap(() => {
        if (!skip) {
          clickAwaySubscription = clickObservable.subscribe(() => {
            window.document.body.click(); // to click away list.
          });
        }
      }),
    ).subscribe((val: any) => {
      setValue(registerName, val, { shouldValidate: true });
      onChangeProp?.(val);
    });

    return () => {
      inputSubscription.unsubscribe();
      clickAwaySubscription?.unsubscribe();
    };
  }, [skip]);

  const onChange = useCallback((value: SelectValue | SelectValue[]) => {
    autoCompleteStore.add<SelectValue | SelectValue[]>(registerName, value);
  }, []);

  return onChange;
}
