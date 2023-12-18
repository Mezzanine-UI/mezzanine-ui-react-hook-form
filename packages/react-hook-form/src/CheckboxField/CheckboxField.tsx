import {
  Checkbox,
  CheckboxProps,
  Typography,
  TypographyProps,
} from '@mezzanine-ui/react';
import { FieldValues, useFormContext, useWatch } from 'react-hook-form';
import BaseField from '../BaseField/BaseField';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import { useDefaultValue } from '../utils/use-default-value';

export type CheckboxFieldProps = HookFormFieldProps<
FieldValues,
Omit<CheckboxProps, 'defaultValue'>,
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
  fullWidth,
  errorMsgRender,
  onChange: onChangeProp,
  defaultChecked,
  disabledErrMsg,
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
    defaultValue: defaultChecked,
  });

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const next = !checked;
    e.target.setAttribute('checked', `${next}`);
    e.target.setAttribute('value', `${next}`);
    setValue(
      registerName,
      next,
      { shouldValidate: true },
    );
    onChangeProp?.(e);
  };

  useDefaultValue(registerName, defaultChecked);

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
      fullWidth={fullWidth}
      disabledErrMsg={disabledErrMsg}
      errorMsgRender={errorMsgRender}
    >
      <Checkbox
        {...props}
        defaultChecked={defaultChecked}
        checked={checked}
        className={fieldClassName}
        onChange={onChange}
        ref={register(registerName).ref}
        value="true"
      >
        {label ? (
          <Typography
            component="div"
            color={color}
            variant={variant}
          >
            {label}
          </Typography>
        ) : null}
      </Checkbox>
    </BaseField>
  );
};

export default CheckboxField;
