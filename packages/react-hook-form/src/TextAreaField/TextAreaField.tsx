import { useMemo } from 'react';
import {
  Textarea,
  TextareaProps,
} from '@mezzanine-ui/react';
import {
  FieldValues,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import BaseField from '../BaseField/BaseField';
import { useDefaultValue } from '../utils/use-default-value';

export type TextAreaFieldProps = HookFormFieldProps<FieldValues, TextareaProps, {
  width?: number;
}>;

const TextAreaField: HookFormFieldComponent<TextAreaFieldProps> = ({
  autoComplete,
  className,
  clearable,
  control,
  defaultValue,
  disabled,
  width,
  label,
  maxLength,
  minLength,
  name,
  placeholder = '請輸入',
  register,
  registerName,
  required,
  remark,
  style,
  errorMsgRender,
  onChange: onChangeProp,
  ...props
}) => {
  const {
    control: contextControl,
    register: contextRegister,
  } = useFormContext();

  const watchValue = useWatch({
    control: control || contextControl,
    name: registerName as string,
    defaultValue,
  });

  useDefaultValue(registerName, defaultValue);

  const {
    errors,
  } = useFormState({ control: control || contextControl });

  const registration = useMemo(() => (register || contextRegister)(
    registerName,
    {
      required,
      disabled,
      maxLength,
      minLength,
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [registerName, required, disabled, maxLength, minLength]);

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    registration.onChange?.(e);
    onChangeProp?.(e);
  };

  return (
    <BaseField
      disabled={disabled}
      style={style}
      label={label || name}
      name={registerName}
      errors={errors}
      remark={remark}
      required={required}
      width={width}
      errorMsgRender={errorMsgRender}
    >
      <Textarea
        {...props}
        fullWidth
        clearable={clearable}
        maxLength={maxLength}
        textareaProps={{
          autoComplete,
          id: registerName,
          name: registerName,
          onBlur: registration.onBlur,
        }}
        {...registration}
        className={className}
        onChange={onChange}
        placeholder={placeholder}
        value={watchValue || ''}
      />
    </BaseField>
  );
};

export default TextAreaField;
