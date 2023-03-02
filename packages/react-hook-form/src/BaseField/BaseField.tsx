/* eslint-disable no-nested-ternary */
import { ErrorMessage } from '@hookform/error-message';
import {
  FormField,
  FormLabel,
  FormMessage,
  cx,
} from '@mezzanine-ui/react';
import { baseFieldClasses } from '@mezzanine-ui/react-hook-form-core';
import {
  CSSProperties, FC,
  ReactNode,
} from 'react';
import { DeepRequired, FieldErrorsImpl, useFormContext } from 'react-hook-form';
import { ErrorMessageFn } from '../typings/error-message';

export interface BaseFieldProps {
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  disabledErrMsg?: boolean;
  errors?: FieldErrorsImpl<DeepRequired<any>>;
  fieldClassName?: string;
  label?: ReactNode;
  labelClassName?: string;
  name: string;
  remark?: ReactNode;
  remarkIcon?: ReactNode;
  required?: boolean;
  style?: CSSProperties;
  baseFieldStyle?: CSSProperties;
  width?: number;
  errorMsgRender?: ErrorMessageFn;
}

const BaseField: FC<BaseFieldProps> = ({
  children,
  className,
  disabled,
  fullWidth = false,
  disabledErrMsg = false,
  errors: errorsProp,
  fieldClassName,
  label,
  labelClassName,
  name,
  remark,
  remarkIcon,
  required,
  style,
  baseFieldStyle,
  width,
  errorMsgRender,
}) => {
  const { formState } = useFormContext();
  const errors = errorsProp || formState.errors;
  const styleVar = {
    '--width': width ? `${width}px` : (fullWidth ? '100%' : undefined),
    ...style,
  } as CSSProperties;
  const baseFieldStyleVar = {
    '--width': width ? `${width}px` : (fullWidth ? '100%' : undefined),
    ...baseFieldStyle,
  } as CSSProperties;
  const isError = !disabledErrMsg && errors?.[name];

  return (
    <FormField
      className={cx(
        baseFieldClasses.host,
        className,
      )}
      style={baseFieldStyleVar}
      disabled={disabled}
      required={required}
      severity={isError ? 'error' : undefined}
    >
      {(typeof label !== 'undefined') && (
        <FormLabel
          className={cx(
            baseFieldClasses.label,
            label === '' && baseFieldClasses.labelWithMinWidth,
            labelClassName,
          )}
          htmlFor={name}
          remark={remark}
          remarkIcon={remarkIcon}
        >
          {label}
        </FormLabel>
      )}
      <div
        className={cx(
          baseFieldClasses.field,
          fieldClassName,
        )}
        style={styleVar}
      >
        {children}
      </div>
      {!disabledErrMsg && (
        <ErrorMessage
          errors={errors}
          name={name}
          render={errorMsgRender || (({ message }) => <FormMessage>{message}</FormMessage>)}
        />
      )}
    </FormField>
  );
};

export default BaseField as FC<BaseFieldProps>;
