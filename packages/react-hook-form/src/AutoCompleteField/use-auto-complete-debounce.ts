import { SelectValue } from '@mezzanine-ui/react';
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Observable, Subject, Subscription, debounceTime, tap } from 'rxjs';
import { isBrowser } from '../utils/type-checker';

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
  const emitter$ = useRef<Subject<SelectValue | SelectValue[]>>();
  const { setValue } = useFormContext();

  useEffect(() => {
    if (!isBrowser()) return;

    emitter$.current = emitter$.current || new Subject<SelectValue | SelectValue[]>();

    let inputObservable$ = emitter$.current.asObservable();
    let clickAwaySubscription: Subscription | undefined;
    let clickObservable$ = new Observable<VoidFunction>((subscriber) => {
      subscriber.next();
    });

    if (!skip) {
      inputObservable$ = inputObservable$.pipe(debounceTime(debounceMs));

      /** 如果是多選，當選完 n 秒後沒動靜，自動關掉下拉選單 */
      if (mode === 'multiple' && !disabledAutoClickAway) {
        clickObservable$ = clickObservable$.pipe(
          debounceTime(autoClickAwayDebounceMs),
        );
      }
    }

    const inputSubscription = inputObservable$.pipe(
      tap(() => {
        if (!skip) {
          clickAwaySubscription = clickObservable$.subscribe(() => {
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
  }, [
    registerName,
    skip,
    debounceMs,
    disabledAutoClickAway,
    autoClickAwayDebounceMs,
    onChangeProp,
  ]);

  const onChange = (value: SelectValue | SelectValue[]) => {
    emitter$.current?.next(value);
  };

  return onChange;
}
