import { DatePicker, DatePickerProps } from '@mezzanine-ui/react';
import { useMemo } from 'react';
import {
  FieldValues,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import BaseField from '../BaseField/BaseField';
import { useDefaultValue } from '../utils/use-default-value';

export type DatePickerFieldProps = HookFormFieldProps<FieldValues, DatePickerProps, {
  width?: number;
}>;

const DatePickerField: HookFormFieldComponent<DatePickerFieldProps> = ({
  clearable = true,
  control,
  disabled,
  format,
  isDateDisabled,
  label,
  mode,
  onCalendarToggle,
  placeholder = '選擇日期',
  readOnly,
  referenceDate,
  register,
  registerName,
  remark,
  required,
  style,
  defaultValue,
  size,
  width,
  errorMsgRender,
  onChange: onChangeProp,
  ...props
}) => {
  const {
    control: contextControl,
    register: contextRegister,
    setValue: contextSetValue,
    clearErrors,
  } = useFormContext();

  const watchingValue = useWatch({ name: registerName, defaultValue });

  const {
    errors,
  } = useFormState({ control: control || contextControl });

  const registration = useMemo(() => (register || contextRegister)(
    registerName,
    {
      required,
      disabled,
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [registerName, required]);

  const onChange = (newDate?: string) => {
    if (errors?.[registerName]) clearErrors(registerName);
    contextSetValue(
      registerName,
      newDate,
      { shouldValidate: true },
    );
    onChangeProp?.(newDate);
  };

  const inputProps = {
    autoComplete: 'off',
    ...registration,
  };

  useDefaultValue(registerName, defaultValue);

  return (
    <BaseField
      disabled={disabled}
      errors={errors}
      style={style}
      label={label}
      name={registerName}
      remark={remark}
      required={required}
      width={width}
      errorMsgRender={errorMsgRender}
    >
      <DatePicker
        {...props}
        fullWidth
        clearable={clearable}
        format={format}
        inputProps={inputProps}
        isDateDisabled={isDateDisabled}
        mode={mode}
        onCalendarToggle={onCalendarToggle}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        referenceDate={referenceDate}
        size={size}
        value={watchingValue}
      />
    </BaseField>
  );
};

export default DatePickerField;
