import {
  AutoComplete, cx, SelectValue,
} from '@mezzanine-ui/react';
import { autoCompleteClasses } from '@mezzanine-ui/react-hook-form-core';
import { AutoCompleteSingleProps } from '@mezzanine-ui/react/Select/AutoComplete';
import { FormEventHandler } from 'react';
import {
  FieldValues, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import BaseField from '../BaseField/BaseField';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import { useDefaultValue } from '../utils/use-default-value';
import { useAutoCompleteDebounce } from './use-auto-complete-debounce';

export type AutoCompleteFieldProps = HookFormFieldProps<
Omit<FieldValues, 'defaultValue' | 'onInput' | 'onChange'>,
Omit<AutoCompleteSingleProps, 'mode'>, {
  defaultValue?: SelectValue;
  debounceMs?: number;
  width?: number;
  onInput?: FormEventHandler<HTMLInputElement>;
  onChange?: (newOption: SelectValue) => void;
}>;

const AutoCompleteField: HookFormFieldComponent<AutoCompleteFieldProps> = ({
  control,
  debounceMs,
  defaultValue,
  disabled,
  fullWidth = true,
  label,
  options,
  placeholder = '請輸入',
  onInput,
  registerName,
  remark,
  required,
  size,
  style,
  className,
  value,
  width,
  errorMsgRender,
  onChange,
  ...props
}) => {
  const { control: contextControl } = useFormContext();

  const watchValue = useWatch({ name: registerName, defaultValue });

  const {
    errors,
  } = useFormState({ control: control || contextControl });

  const onDebounceChange = useAutoCompleteDebounce({
    registerName,
    debounceMs,
    skip: !debounceMs,
    onChange,
  }, 'single');

  useDefaultValue(registerName, defaultValue);

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
        mode="single"
        aria-autocomplete="none"
        menuSize="large"
        itemsInView={10}
        size={size}
        fullWidth={width ? false : fullWidth}
        onChange={onDebounceChange}
        inputProps={{ onInput }}
        placeholder={placeholder}
        defaultValue={defaultValue}
        options={options}
        value={watchValue}
      />
    </BaseField>
  );
};

export default AutoCompleteField;
