import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

type UseDefaultValueOptions = Partial<{
  /** @deprecated */
  shouldValidate: boolean;
  /** @deprecated */
  shouldDirty: boolean;
  /** @deprecated */
  shouldTouch: boolean;
  keepDirty: boolean,
  keepError: boolean,
  keepTouched: boolean,
}>;

export function useDefaultValue<V>(
  registerName: string,
  defaultValue: V,
  options?: UseDefaultValueOptions,
) {
  const defaultValueRef = useRef<V | undefined>();
  const { setValue, resetField } = useFormContext();

  useEffect(() => {
    if (typeof defaultValue !== 'undefined' &&  typeof defaultValueRef.current === 'undefined') {
      defaultValueRef.current = defaultValue;
      resetField(registerName, {
        keepDirty: options?.keepDirty || false,
        keepError: options?.keepError || false,
        keepTouched: options?.keepTouched || false,
        defaultValue: defaultValue,
      });
      setValue(registerName, defaultValue, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });

      return () => {
        defaultValueRef.current = undefined;
      };
    }
  }, [registerName, defaultValue, options]);

  return defaultValueRef;
}
