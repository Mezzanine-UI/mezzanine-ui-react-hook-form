import { ErrorMessage } from '@hookform/error-message';
import { baseFieldClasses } from '@mezzanine-ui/react-hook-form-core';
import {
  FormField,
  FormLabel,
  FormMessage,
  cx,
} from '@mezzanine-ui/react';
import {
  CSSProperties, FC, memo,
  ReactNode,
} from 'react';
import { DeepRequired, FieldErrorsImpl } from 'react-hook-form';
import { ErrorMessageFn } from '../typings/error-message';

export interface BaseFieldProps {
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  disabledErrMsg?: boolean;
  errors: FieldErrorsImpl<DeepRequired<any>>;
  fieldClassName?: string;
  label?: ReactNode;
  labelClassName?: string;
  name: string;
  remark?: ReactNode;
  remarkIcon?: ReactNode;
  required?: boolean;
  style?: CSSProperties;
  width?: number;
  errorMsgRender?: ErrorMessageFn;
}

const BaseField: FC<BaseFieldProps> = ({
  children,
  className,
  disabled,
  fullWidth = false,
  disabledErrMsg = false,
  errors,
  fieldClassName,
  label,
  labelClassName,
  name,
  remark,
  remarkIcon,
  required,
  style,
  width,
  errorMsgRender,
}) => {
  const styleVar = {
    // eslint-disable-next-line no-nested-ternary
    '--width': width ? `${width}px` : (fullWidth ? '100%' : undefined),
    ...style,
  } as CSSProperties;

  return (
    <FormField
      className={cx(
        baseFieldClasses.host,
        className,
      )}
      style={styleVar}
      disabled={disabled}
      required={required}
      severity={errors?.[name] ? 'error' : undefined}
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

export default memo(BaseField) as FC<BaseFieldProps>;
