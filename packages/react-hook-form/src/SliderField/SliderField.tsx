/* eslint-disable react-hooks/exhaustive-deps */
import { Slider, SliderProps } from '@mezzanine-ui/react';
import { CSSProperties, useEffect, useMemo } from 'react';
import {
  FieldValues, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import BaseField from '../BaseField/BaseField';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';

export type SliderFieldProps = HookFormFieldProps<
FieldValues,
Omit<SliderProps, 'value' | 'defaultValue'>, {
  defaultValue?: number;
  width?: number;
}>;

const SliderField: HookFormFieldComponent<SliderFieldProps> = ({
  control,
  min = 0,
  max = 100,
  disabled,
  label,
  register,
  registerName,
  defaultValue,
  remark,
  required,
  step = 1,
  withInput = true,
  style,
  width,
  errorMsgRender,
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

  const watchValue = useWatch({ name: registerName }) || defaultValue || 100;

  useMemo(() => (register || contextRegister)(
    registerName,
    {
      required,
      disabled,
    },
  ), [registerName, required, disabled]);

  useEffect(() => {
    setValue(registerName, defaultValue);
  }, []);

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
        onChange={(next: any) => setValue(registerName, next)}
      />
    </BaseField>
  );
};

export default SliderField;
