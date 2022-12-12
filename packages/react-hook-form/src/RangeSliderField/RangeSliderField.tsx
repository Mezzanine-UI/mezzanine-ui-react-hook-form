/* eslint-disable react-hooks/exhaustive-deps */
import { RangeSliderValue, Slider, SliderProps } from '@mezzanine-ui/react';
import { CSSProperties, useMemo } from 'react';
import {
  FieldValues, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import BaseField from '../BaseField/BaseField';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import { useDefaultValue } from '../utils/use-default-value';

export type RangeSliderFieldProps = HookFormFieldProps<
FieldValues,
Omit<SliderProps, 'value' | 'defaultValue' | 'onChange'>, {
  defaultValue?: [number, number];
  width?: number;
  onChange?: (value: RangeSliderValue) => void
}>;

const RangeSliderField: HookFormFieldComponent<RangeSliderFieldProps> = ({
  control,
  min = 0,
  max = 100,
  disabled,
  label,
  withInput = true,
  register,
  registerName,
  defaultValue,
  remark,
  required,
  step = 1,
  style,
  width,
  fullWidth = true,
  errorMsgRender,
  onChange: onChangeProp,
  ...props
}) => {
  const {
    control: contextControl,
    register: contextRegister,
    setValue,
  } = useFormContext();

  const {
    errors,
  } = useFormState({ control: control || contextControl });

  const watchValue = useWatch({ name: registerName }) || defaultValue || [min, max];

  const onChange = (v: RangeSliderValue) => {
    setValue(registerName, v, { shouldValidate: true });
    onChangeProp?.(v);
  };

  useMemo(() => (register || contextRegister)(
    registerName,
    {
      required,
      disabled,
    },
  ), [registerName, required, disabled]);

  useDefaultValue(registerName, defaultValue);

  return (
    <BaseField
      disabled={disabled}
      style={{
        ...style,
        '--width': '100%',
      } as CSSProperties}
      label={label}
      name={registerName}
      remark={remark}
      errors={errors}
      required={required}
      fullWidth={fullWidth}
      width={width}
      errorMsgRender={errorMsgRender}
    >
      <Slider
        {...props}
        withInput={withInput}
        min={min}
        max={max}
        step={step}
        value={watchValue}
        onChange={onChange}
      />
    </BaseField>
  );
};

export default RangeSliderField;
