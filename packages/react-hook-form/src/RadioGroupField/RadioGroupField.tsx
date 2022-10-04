import {
  cx,
  RadioGroup,
  RadioGroupProps,
} from '@mezzanine-ui/react';
import { ChangeEvent, useEffect } from 'react';
import { FieldValues, useFormContext, useWatch } from 'react-hook-form';
import { radioGroupClasses } from '@mezzanine-ui/react-hook-form-core';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import BaseField from '../BaseField/BaseField';

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
  ...props
}) => {
  const value = useWatch({ name: registerName });
  const defaultValue = defaultValueProp || value;
  const { setValue, formState: { errors } } = useFormContext();
  const onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(registerName, e.target.value);

  useEffect(() => {
    if (defaultValue) {
      setValue(registerName, defaultValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
