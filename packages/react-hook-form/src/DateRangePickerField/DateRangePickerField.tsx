import { RangePickerValue } from '@mezzanine-ui/core/picker';
import { DateRangePicker, DateRangePickerProps } from '@mezzanine-ui/react';
import {
  FieldValues,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import BaseField from '../BaseField/BaseField';
import { useDefaultValue } from '../utils/use-default-value';

export type DateRangePickerFieldProps = HookFormFieldProps<FieldValues, DateRangePickerProps, {
  width?: number;
}>;

const DateRangePickerField: HookFormFieldComponent<DateRangePickerFieldProps> = ({
  clearable = true,
  control,
  defaultValue,
  disabled,
  inputFromPlaceholder = '起始日',
  inputToPlaceholder = '結束日',
  label,
  register,
  registerName,
  remark,
  required,
  style,
  width,
  errorMsgRender,
  disabledErrMsg,
  onChange: onChangeProp,
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
    defaultValue,
  });

  const {
    errors,
  } = useFormState({ control: control || contextControl });

  const registration = (register || contextRegister)(
    registerName,
    {
      required,
    },
  );

  const inputProps = {
    autoComplete: 'off',
    ...registration,
  };

  const onChange = (newDate?: RangePickerValue) => {
    setValue(
      registerName,
      newDate,
      { shouldValidate: true },
    );
    onChangeProp?.(newDate);
  };

  useDefaultValue(registerName, defaultValue);

  return (
    <BaseField
      disabled={disabled}
      errors={errors}
      label={label}
      name={registerName}
      remark={remark}
      required={required}
      style={style}
      width={width}
      disabledErrMsg={disabledErrMsg}
      errorMsgRender={errorMsgRender}
    >
      <DateRangePicker
        {...props}
        fullWidth
        clearable={clearable}
        inputFromPlaceholder={inputFromPlaceholder}
        inputToPlaceholder={inputToPlaceholder}
        inputToProps={inputProps}
        onChange={onChange}
        value={watchValue}
      />
    </BaseField>
  );
};

export default DateRangePickerField;
