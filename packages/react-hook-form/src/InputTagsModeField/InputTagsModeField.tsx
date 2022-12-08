/* eslint-disable react-hooks/exhaustive-deps */
import { cx, Input, InputProps } from '@mezzanine-ui/react';
import { inputFieldClasses } from '@mezzanine-ui/react-hook-form-core';
import { TagsType } from '@mezzanine-ui/react/Form/useInputWithTagsModeValue';
import { useCallback, useMemo } from 'react';
import {
  FieldValues, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import BaseField from '../BaseField/BaseField';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import { useDefaultValue } from '../utils/use-default-value';

type OmittedInputProps = Omit<InputProps, 'mode' | 'tagsProps' | 'defaultValue' | 'onChange'> & InputProps['tagsProps'];

export type InputTagsModeFieldProps<
  T extends FieldValues = FieldValues> = HookFormFieldProps<T, OmittedInputProps, {
    maxLength?: number;
    minLength?: number;
    defaultValue?: string[];
    inputDefaultValue?: string;
    width?: number;
    inputClassName?: string;
  }>;

const InputTagsModeField: HookFormFieldComponent<InputTagsModeFieldProps> = ({
  autoComplete = 'off',
  autoFocus,
  className,
  clearable = true,
  control,
  defaultValue,
  inputDefaultValue,
  disabled,
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
  valueAsDate,
  valueAsNumber,
  role,
  size,
  style,
  suffix,
  initialTagsValue,
  maxTagsLength,
  inputClassName,
  inputPosition,
  errorMsgRender,
  onTagsChange: onTagsChangeProp,
  ...props
}) => {
  const {
    control: contextControl,
    register: contextRegister,
    setValue,
  } = useFormContext();

  const watchValue = useWatch({
    control: control || contextControl,
    name: registerName as string,
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
    },
  ), [registerName, required, disabled, maxLength, minLength]);

  const onTagsChange = useCallback((newTags: TagsType) => {
    setValue(
      registerName,
      newTags,
    );
    onTagsChangeProp?.(newTags);
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
      errors={errors}
      style={style}
      required={required}
      remark={remark}
      disabled={disabled}
      label={label}
      width={width}
      errorMsgRender={errorMsgRender}
    >
      <Input
        {...props}
        fullWidth
        role={role}
        className={inputClassName}
        size={size}
        clearable={clearable}
        placeholder={placeholder}
        prefix={prefix}
        defaultValue={inputDefaultValue}
        disabled={disabled}
        mode="tags"
        required={required}
        suffix={suffix}
        tagsProps={{
          initialTagsValue: watchValue || defaultValue || [],
          maxTagsLength,
          inputPosition,
          onTagsChange,
        }}
        inputProps={{
          autoComplete,
          autoFocus,
          maxLength,
          minLength,
          type: 'text',
          ...registration,
        }}
      />
    </BaseField>
  );
};

export default InputTagsModeField;
