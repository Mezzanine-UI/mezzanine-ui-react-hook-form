import {
  CheckboxGroup,
  CheckboxGroupOption,
  CheckboxGroupProps,
  cx,
} from '@mezzanine-ui/react';
import { Orientation } from '@mezzanine-ui/system/orientation';
import {
  FieldValues,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { checkboxGroupClasses } from '@mezzanine-ui/react-hook-form-core';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import BaseField from '../BaseField/BaseField';
import { useDefaultValue } from '../utils/use-default-value';

export type CheckboxGroupFieldProps = HookFormFieldProps<FieldValues, Omit<CheckboxGroupProps, 'defaultValue'>, {
  options: CheckboxGroupOption[];
  orientation: Orientation;
  defaultValue?: string[];
  fieldClassName?: string;
  width?: number;
}>;

const CheckboxGroupField: HookFormFieldComponent<CheckboxGroupFieldProps> = ({
  className,
  fieldClassName,
  control,
  defaultValue,
  disabled,
  label,
  options,
  width,
  orientation,
  registerName,
  remark,
  style,
  disabledErrMsg,
  errorMsgRender,
  onChange: onChangeProp,
  required,
  ...props
}) => {
  const {
    control: contextControl,
    setValue,
    clearErrors,
  } = useFormContext();

  const watchValue = useWatch({ name: registerName, defaultValue });

  const {
    errors,
  } = useFormState({ control: control || contextControl });

  const onChange: (value: string[], event: React.ChangeEvent<HTMLInputElement>) => void = (newValues, e) => {
    if (errors?.[registerName]) clearErrors(registerName);
    setValue(registerName, newValues, { shouldValidate: true });
    onChangeProp?.(newValues, e);
  };

  useDefaultValue(registerName, defaultValue);

  return (
    <BaseField
      disabled={disabled}
      errors={errors}
      label={label}
      required={required}
      remark={remark}
      name={registerName}
      style={style}
      className={className}
      width={width}
      disabledErrMsg={disabledErrMsg}
      errorMsgRender={errorMsgRender}
    >
      <CheckboxGroup
        {...props}
        orientation={orientation}
        options={options}
        defaultValue={defaultValue}
        className={cx(checkboxGroupClasses.host, fieldClassName)}
        value={watchValue}
        onChange={onChange}
      />
    </BaseField>
  );
};

export default CheckboxGroupField;
