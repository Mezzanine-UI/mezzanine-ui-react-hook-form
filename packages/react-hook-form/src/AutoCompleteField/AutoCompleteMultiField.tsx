import {
  AutoComplete,
  cx,
  SelectValue,
} from '@mezzanine-ui/react';
import { FormEventHandler } from 'react';
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

export type AutoCompleteMultiFieldProps = HookFormFieldProps<
Omit<FieldValues, 'defaultValues'>,
Omit<AutoCompleteMultipleProps, 'mode' | 'onChange'>, {
  defaultValues?: SelectValue[];
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
  const { control: contextControl } = useFormContext();

  const {
    errors,
  } = useFormState({ control: control || contextControl });

  const watchingValue = useWatch({ name: registerName });

  const onDebounceChange = useAutoCompleteDebounce({
    registerName,
    debounceMs,
    autoClickAwayDebounceMs,
    disabledAutoClickAway,
    skip: !debounce,
    onChange,
  }, 'multiple');

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
        onChange={onDebounceChange}
        options={options}
        placeholder={placeholder}
        defaultValue={defaultValues || watchingValue}
        inputProps={{ onInput }}
        value={value}
      />
    </BaseField>
  );
};

export default AutoCompleteMultiField;
