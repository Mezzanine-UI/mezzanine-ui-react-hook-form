import { passwordFieldClasses } from '@mezzanine-ui/react-hook-form-core';
import { EyeIcon, EyeSlashIcon } from '@mezzanine-ui/icons';
import { Icon, Typography } from '@mezzanine-ui/react';
import { useState } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';

import InputField, { InputFieldProps } from '../InputField/InputField';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';

export type PassWordFieldProps = HookFormFieldProps<FieldValues, Omit<InputFieldProps, 'clearable'>, {
  remarkText?: string;
}>;

const PasswordField: HookFormFieldComponent<PassWordFieldProps> = ({
  register,
  remark,
  remarkText,
  ...props
}) => {
  const { trigger } = useFormContext();
  const [passwordMasking, setPasswordMasking] = useState(true);

  const renderRemark = remark ?? (
    !remarkText ? null : (
      <Typography
        color="text-secondary"
        variant="caption"
      >
        {remarkText}
      </Typography>
    )
  );

  const renderSuffix = (
    <Icon
      onClick={() => setPasswordMasking((prev) => !prev)}
      className={passwordFieldClasses.icon}
      icon={passwordMasking ? EyeSlashIcon : EyeIcon}
    />
  );

  return (
    <InputField
      {...props}
      clearable={false}
      type={passwordMasking ? 'password' : undefined}
      suffix={renderSuffix}
      remark={renderRemark}
      onChange={(e) => {
        props?.onChange?.(e);
        trigger(props.registerName);
      }}
    />
  );
};

export default PasswordField;
