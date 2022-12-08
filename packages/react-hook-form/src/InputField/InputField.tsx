/* eslint-disable react-hooks/exhaustive-deps */
import {
  cx, InputProps,
} from '@mezzanine-ui/react';
import { inputFieldClasses } from '@mezzanine-ui/react-hook-form-core';
import {
  useCallback, useMemo,
} from 'react';
import {
  FieldValues, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import BaseField from '../BaseField/BaseField';
import Input from '../Mezzanine/Input';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import { useDefaultValue } from '../utils/use-default-value';

/** -------------------------------------------------------------------------------- */

export type InputFieldProps<
  T extends FieldValues = FieldValues> = HookFormFieldProps<T, InputProps, {
    maxLength?: number;
    minLength?: number;
    width?: number;
    inputClassName?: string;
  }>;

const InputField: HookFormFieldComponent<InputFieldProps> = ({
  autoComplete = 'off',
  autoFocus,
  className,
  inputClassName,
  clearable = true,
  control,
  defaultValue,
  disabled,
  disabledErrMsg,
  width,
  label,
  maxLength,
  min,
  minLength,
  name,
  placeholder = '請輸入',
  prefix,
  register,
  registerName,
  remark,
  required,
  role,
  size,
  style,
  suffix,
  tagsProps,
  type,
  errorMsgRender,
  onChange: onChangeProp,
  ...prop
}) => {
  const {
    control: contextControl,
    register: contextRegister,
    resetField,
  } = useFormContext();

  const watchValue = useWatch({
    control: control || contextControl,
    name: registerName as string,
    defaultValue,
  });

  const {
    errors,
  } = useFormState({ control: control || contextControl });

  const registration = useMemo(() => (register || contextRegister)(
    registerName,
    {
      required,
      disabled,
      maxLength,
      min,
      minLength,
      valueAsDate: prop.valueAsDate,
      valueAsNumber: prop.valueAsNumber,
      onChange: onChangeProp,
    },
  ), [registerName, required, disabled, maxLength, minLength]);

  const onClear = useCallback(() => {
    resetField(registerName);
  }, []);

  useDefaultValue(registerName, defaultValue);

  return (
    <BaseField
      className={cx(
        inputFieldClasses.host,
        width && inputFieldClasses.specifiedWidth,
        className,
      )}
      name={registerName}
      disabledErrMsg={disabledErrMsg}
      errors={errors}
      style={style}
      required={required}
      remark={remark}
      disabled={disabled}
      label={name || label}
      width={width}
      errorMsgRender={errorMsgRender}
    >
      <Input
        {...prop}
        fullWidth
        role={role}
        className={inputClassName}
        size={size}
        clearable={clearable}
        defaultValue={defaultValue}
        placeholder={placeholder}
        prefix={prefix}
        disabled={disabled}
        value={watchValue || ''}
        required={required}
        suffix={suffix}
        onClear={onClear}
        tagsProps={tagsProps}
        inputProps={{
          autoComplete,
          autoFocus,
          maxLength,
          minLength,
          type,
          ...registration,
        }}
      />
    </BaseField>
  );
};

export default InputField;
