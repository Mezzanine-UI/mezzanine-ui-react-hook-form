import {
  cx,
  RadioGroup,
  RadioGroupProps,
} from '@mezzanine-ui/react';
import { ChangeEvent } from 'react';
import { FieldValues, useFormContext, useWatch } from 'react-hook-form';
import { radioGroupClasses } from '@mezzanine-ui/react-hook-form-core';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import BaseField from '../BaseField/BaseField';
import { useDefaultValue } from '../utils/use-default-value';

export type RadioGroupFieldProps = HookFormFieldProps<FieldValues, RadioGroupProps>;

const RadioGroupField: HookFormFieldComponent<RadioGroupFieldProps> = ({
  defaultValue: defaultValueProp,
  disabled,
  label,
  options,
  orientation,
  registerName,
  style,
  size,
  errorMsgRender,
  onChange: onChangeProp,
  ...props
}) => {
  const value = useWatch({ name: registerName });
  const defaultValue = defaultValueProp || value;
  const { setValue, formState: { errors } } = useFormContext();
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(registerName, e.target.value, { shouldValidate: true });
    onChangeProp?.(e);
  };

  useDefaultValue(registerName, defaultValue);

  return (
    <BaseField
      disabled={disabled}
      name={registerName}
      errors={errors}
      label={label}
      className={cx(label && radioGroupClasses.label)}
      errorMsgRender={errorMsgRender}
    >
      <RadioGroup
        {...props}
        defaultValue={defaultValue}
        value={value}
        disabled={disabled}
        onChange={onChange}
        options={options}
        orientation={orientation}
        size={size}
      />
    </BaseField>
  );
};

export default RadioGroupField;
