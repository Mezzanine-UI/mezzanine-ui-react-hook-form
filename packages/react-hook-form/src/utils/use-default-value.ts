import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

type UseDefaultValueOptions = Partial<{
  shouldValidate: boolean;
  shouldDirty: boolean;
  shouldTouch: boolean;
}>;

export function useDefaultValue<V>(
  registerName: string,
  defaultValue: V,
  options?: UseDefaultValueOptions,
) {
  const defaultValueRef = useRef<V | undefined>();
  const { setValue } = useFormContext();

  useEffect(() => {
    if (typeof defaultValue !== 'undefined' &&  typeof defaultValueRef.current === 'undefined') {
      defaultValueRef.current = defaultValue;
      setValue(registerName, defaultValue, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
        ...(options || {}),
      });
    }
  }, [defaultValue]);

  return defaultValueRef;
}
