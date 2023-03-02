/* eslint-disable react-hooks/exhaustive-deps */
import {
  Input,
  InputProps,
  cx,
} from '@mezzanine-ui/react';
import { inputFieldClasses } from '@mezzanine-ui/react-hook-form-core';
import { ChangeEventHandler } from 'react';
import {
  FieldValues, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import BaseField from '../BaseField/BaseField';
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
    setValue,
  } = useFormContext();

  const watchValue = useWatch({
    control: control || contextControl,
    name: registerName as string,
    defaultValue,
  });

  const {
    errors,
  } = useFormState({ control: control || contextControl });

  const registration = (register || contextRegister)(
    registerName,
    {
      required,
      maxLength,
      min,
      minLength,
      valueAsDate: prop.valueAsDate,
      valueAsNumber: prop.valueAsNumber,
    },
  );

  const bindDefaultValueRef = useDefaultValue(registerName, defaultValue);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.type === 'change') {
      setValue(registerName, e.target.value, {
        shouldDirty: e.target.value !== bindDefaultValueRef.current,
        shouldTouch: true,
      });
      onChangeProp?.(e);
    } else {
      resetField(registerName, {
        keepDirty: false,
        keepError: false,
        keepTouched: false,
      });
    }
  };

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
        {...registration}
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
        onChange={onChange}
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
