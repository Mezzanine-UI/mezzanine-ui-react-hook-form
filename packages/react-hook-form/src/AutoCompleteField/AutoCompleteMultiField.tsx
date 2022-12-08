import {
  AutoComplete,
  cx,
  SelectValue,
} from '@mezzanine-ui/react';
import { FormEventHandler, useEffect, useState } from 'react';
import {
  FieldValues,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { autoCompleteClasses } from '@mezzanine-ui/react-hook-form-core';
import { AutoCompleteMultipleProps } from '@mezzanine-ui/react/Select/AutoComplete';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import { useAutoCompleteDebounce } from './use-auto-complete-debounce';
import BaseField from '../BaseField/BaseField';
import { useDefaultValue } from '../utils/use-default-value';

export type AutoCompleteMultiFieldProps = HookFormFieldProps<
Omit<FieldValues, 'defaultValues' | 'defaultValue'>,
Omit<AutoCompleteMultipleProps, 'mode' | 'onChange'>, {
  /**
   * @description use defaultValue
   *
   * @deprecated
  */
  defaultValues?: SelectValue[];
  defaultValue?: SelectValue[];
  debounce?: boolean;
  debounceMs?: number;
  autoClickAwayDebounceMs?: number;
  disabledAutoClickAway?: boolean;
  width?: number;
  onInput?: FormEventHandler<HTMLInputElement>;
  onChange?: (newOptions?: SelectValue[]) => void;
}>;

const AutoCompleteMultiField: HookFormFieldComponent<AutoCompleteMultiFieldProps> = ({
  control,
  className,
  debounce = true,
  debounceMs,
  defaultValues,
  defaultValue,
  autoClickAwayDebounceMs,
  disabledAutoClickAway,
  disabled,
  fullWidth = true,
  label,
  options,
  placeholder = '請輸入',
  registerName,
  remark,
  required,
  size,
  style,
  value,
  width,
  onInput,
  errorMsgRender,
  onChange,
  ...props
}) => {
  const [data, setData] = useState(defaultValue || defaultValues || []);
  const { control: contextControl } = useFormContext();

  const {
    errors,
  } = useFormState({ control: control || contextControl });

  const watchingValue = useWatch({ name: registerName, defaultValue: defaultValue || defaultValues });

  const onDebounceChange = useAutoCompleteDebounce({
    registerName,
    debounceMs,
    autoClickAwayDebounceMs,
    disabledAutoClickAway,
    skip: !debounce,
    onChange,
  }, 'multiple');

  useEffect(() => {
    setData(watchingValue || []);
  }, [watchingValue]);

  useDefaultValue(registerName, defaultValue || defaultValues);

  return (
    <BaseField
      disabled={disabled}
      style={style}
      label={label}
      name={registerName}
      remark={remark}
      errors={errors}
      required={required}
      width={width}
      errorMsgRender={errorMsgRender}
      className={cx(
        autoCompleteClasses.host,
        className,
      )}
    >
      <AutoComplete
        {...props}
        mode="multiple"
        aria-autocomplete="none"
        menuSize="large"
        itemsInView={10}
        size={size}
        fullWidth={width ? false : fullWidth}
        options={options}
        placeholder={placeholder}
        defaultValue={defaultValue || defaultValues || watchingValue}
        inputProps={{ onInput }}
        value={data}
        onChange={(newData) => {
          setData(newData);
          onDebounceChange?.(newData);
        }}
      />
    </BaseField>
  );
};

export default AutoCompleteMultiField;
