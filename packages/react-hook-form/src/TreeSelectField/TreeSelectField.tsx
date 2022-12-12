import { TreeSelect, TreeSelectOption, TreeSelectProps } from '@mezzanine-ui/react';
import { FieldValues, useFormContext, useWatch } from 'react-hook-form';
import { BaseField } from '../BaseField';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import { useDefaultValue } from '../utils/use-default-value';

export type TreeSelectFieldProps = HookFormFieldProps<FieldValues, TreeSelectProps, {
  width?: number;
  defaultValue?: TreeSelectOption[];
}>;

const TreeSelectField: HookFormFieldComponent<TreeSelectFieldProps> = ({
  className,
  clearable = true,
  defaultValue,
  disabled,
  fullWidth = false,
  label,
  placeholder = '請選擇',
  registerName,
  remark,
  required,
  style,
  width,
  errorMsgRender,
  onChange: onChangeProp,
  value,
  ...props
}) => {
  const {
    clearErrors,
    formState: { errors },
    setValue,
  } = useFormContext();

  const watchValue = useWatch({
    name: registerName as string,
    defaultValue,
  });

  const onChange = (newValue: TreeSelectOption[]) => {
    if (errors?.[registerName]) clearErrors(registerName);
    setValue(
      registerName,
      newValue,
      { shouldValidate: true },
    );
    onChangeProp?.(newValue);
  };

  useDefaultValue(registerName, defaultValue);

  return (
    <BaseField
      disabled={disabled}
      name={registerName}
      style={style}
      label={label}
      remark={remark}
      required={required}
      className={className}
      width={width}
      errors={errors}
      errorMsgRender={errorMsgRender}
    >
      <TreeSelect
        {...props}
        clearable={clearable}
        fullWidth={fullWidth}
        placeholder={placeholder}
        onChange={onChange}
        value={watchValue}
      />
    </BaseField>
  );
};

export default TreeSelectField;
