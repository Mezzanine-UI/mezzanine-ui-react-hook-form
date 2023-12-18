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
import BaseField from '../BaseField/BaseField';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
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
  fullWidth,
  required,
  remark,
  style,
  disabledErrMsg,
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

  const registration = (register || contextRegister)(
    registerName,
    {
      required,
      maxLength,
      minLength,
    },
  );

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
      fullWidth={fullWidth}
      disabledErrMsg={disabledErrMsg}
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
