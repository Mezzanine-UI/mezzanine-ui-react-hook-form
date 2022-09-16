/* eslint-disable react-hooks/exhaustive-deps */
import { SearchIcon } from '@mezzanine-ui/icons';
import { Icon } from '@mezzanine-ui/react';
import {
  memo,
  useEffect,
} from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import type { InputFieldProps } from '../InputField/InputField';
import Input from '../Mezzanine/Input';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
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
  ...props
}) => {
  const { setValue } = useFormContext();

  const debounceMs = debounced ? debounceMsProp : 0;
  const watchedDebouncedValue = useDebouncedValue({ inputId: registerName, debounceMs });

  const onClear = useClearDebouncedSearch({
    registerName,
    setValue,
  });

  useEffect(() => {
    if (typeof watchedDebouncedValue === 'string') {
      setValue(registerName, watchedDebouncedValue);

      if (watchedDebouncedValue === '') onClear();
    }
  }, [registerName, watchedDebouncedValue]);

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

export default memo(SearchInputField) as typeof SearchInputField;
