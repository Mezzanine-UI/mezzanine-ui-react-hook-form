import { TreeSelect, TreeSelectOption, TreeSelectProps } from '@mezzanine-ui/react';
import { useEffect } from 'react';
import { FieldValues, useFormContext, useWatch } from 'react-hook-form';
import { BaseField } from '../BaseField';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';

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
  ...props
}) => {
  const {
    clearErrors,
    formState: { errors },
    control,
    setValue,
  } = useFormContext();

  const watchValue = useWatch({
    control,
    name: registerName as string,
    defaultValue,
  }) || defaultValue;

  const onChange = (newValue: TreeSelectOption[]) => {
    if (errors?.[registerName]) clearErrors(registerName);

    setValue(
      registerName,
      newValue,
    );
  };

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
