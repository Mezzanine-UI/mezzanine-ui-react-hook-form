import { useEffect } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';

export type DefaultValueFieldProps = HookFormFieldProps<FieldValues, {
  defaultValue: any
}>;

const DefaultValueField: HookFormFieldComponent<DefaultValueFieldProps> = ({
  defaultValue,
  registerName,
}) => {
  const { setValue } = useFormContext();

  useEffect(() => {
    setValue(registerName, defaultValue);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default DefaultValueField;
