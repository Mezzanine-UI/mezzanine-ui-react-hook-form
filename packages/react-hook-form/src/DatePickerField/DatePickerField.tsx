import { DatePicker, DatePickerProps } from '@mezzanine-ui/react';
import {
  FieldValues,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import BaseField from '../BaseField/BaseField';
import { useDefaultValue } from '../utils/use-default-value';

export type DatePickerFieldProps = Omit<HookFormFieldProps<FieldValues, DatePickerProps, {
  width?: number;
}>, 'children'>;

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
  fullWidth,
  errorMsgRender,
  disabledErrMsg,
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

  const registration = (register || contextRegister)(
    registerName,
    {
      required,
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  );

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
      fullWidth={fullWidth}
      disabledErrMsg={disabledErrMsg}
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
