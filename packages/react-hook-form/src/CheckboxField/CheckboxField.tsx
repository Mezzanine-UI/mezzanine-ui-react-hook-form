import {
  Checkbox,
  CheckboxProps,
  Typography,
  TypographyProps,
} from '@mezzanine-ui/react';
import { FieldValues, useFormContext, useWatch } from 'react-hook-form';
import BaseField from '../BaseField/BaseField';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';

export type CheckboxFieldProps = HookFormFieldProps<
FieldValues,
CheckboxProps,
Pick<TypographyProps, 'color' | 'variant'> & {
  fieldClassName?: string;
  width?: number;
  labelSpacing?: boolean;
}>;

const CheckboxField: HookFormFieldComponent<CheckboxFieldProps> = ({
  className,
  color,
  control,
  disabled,
  fieldClassName,
  label,
  labelSpacing = false,
  registerName,
  remark,
  required,
  style,
  variant,
  width,
  errorMsgRender,
  ...props
}) => {
  const {
    control: contextControl,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const checked = useWatch({
    name: registerName,
    control: control || contextControl,
  });

  const onChange = () => {
    setValue(
      registerName,
      !checked,
    );
  };

  return (
    <BaseField
      className={className}
      disabled={disabled}
      errors={errors}
      label={labelSpacing ? '' : undefined}
      name={registerName}
      remark={remark}
      required={required}
      style={style}
      width={width}
      errorMsgRender={errorMsgRender}
    >
      <Checkbox
        {...props}
        checked={checked}
        className={fieldClassName}
        onChange={onChange}
        ref={register(registerName).ref}
        value="true"
      >
        <Typography
          color={color}
          variant={variant}
        >
          {label}
        </Typography>
      </Checkbox>
    </BaseField>
  );
};

export default CheckboxField;
