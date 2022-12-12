/* eslint-disable react-hooks/exhaustive-deps */
import { SearchIcon } from '@mezzanine-ui/icons';
import { Icon } from '@mezzanine-ui/react';
import { useEffect, useMemo } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { Subject } from 'rxjs';
import type { InputFieldProps } from '../InputField/InputField';
import Input from '../Mezzanine/Input';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import { useDefaultValue } from '../utils/use-default-value';
import { useClearDebouncedSearch } from './use-clear-debounced-search';
import { useDebouncedValue } from './use-debounced-value';

export type SearchInputFieldProps = HookFormFieldProps<FieldValues, InputFieldProps, {
  debounced?: boolean,
  debounceMs?: number;
}>;

const SearchInputField: HookFormFieldComponent<SearchInputFieldProps> = ({
  className,
  clearable = true,
  debounced = true,
  debounceMs: debounceMsProp,
  defaultValue,
  disabled,
  placeholder = '請輸入關鍵字進行搜尋...',
  prefix,
  register,
  registerName,
  required,
  size = 'medium',
  style,
  suffix,
  min,
  max,
  pattern,
  onChange: onChangeProp,
  ...props
}) => {
  const cancelDebounce$ = useMemo(() => new Subject<void>(), []);
  const { setValue } = useFormContext();
  const debounceMs = debounced ? debounceMsProp : 0;
  const watchedDebouncedValue = useDebouncedValue({
    cancel$: cancelDebounce$,
    inputId: registerName,
    debounceMs,
    onChange: onChangeProp,
  });

  const clearInput = useClearDebouncedSearch({
    registerName,
    setValue,
  });

  const onClear = () => {
    cancelDebounce$.next();
    clearInput();
  };

  useEffect(() => {
    if (typeof watchedDebouncedValue === 'string') {
      setValue(registerName, watchedDebouncedValue, { shouldValidate: true });

      if (!watchedDebouncedValue) onClear();
    }
  }, [registerName, watchedDebouncedValue]);

  useDefaultValue(registerName, defaultValue);

  return (
    <Input
      fullWidth
      clearable={clearable}
      style={style}
      className={className}
      size={size}
      defaultValue={defaultValue}
      placeholder={placeholder}
      prefix={prefix || (<Icon icon={SearchIcon} />)}
      disabled={disabled}
      required={required}
      suffix={suffix}
      onClear={onClear}
      inputProps={{
        ...props,
        id: registerName,
        type: 'search',
        max: max?.toString(),
        min: min?.toString(),
      }}
    />
  );
};

export default SearchInputField;
