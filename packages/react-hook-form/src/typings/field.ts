import {
  CSSProperties,
  HTMLInputTypeAttribute,
  ReactNode,
} from 'react';
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { ErrorMessageFn } from './error-message';

export interface FieldProps<Type extends  FieldValues> extends Omit<
RegisterOptions<Type>, 'render' | 'onChange' | 'onBlur'> {
  disabled?: boolean;
  disabledErrMsg?: boolean;
  label?: ReactNode;
  placeholder?: string;
  required?: boolean;
  autoComplete?: 'on' | 'off';
  autoFocus?: boolean;
  remark?: ReactNode;
  remarkIcon?: ReactNode;
  style?: CSSProperties;
  className?: string;
  type?: HTMLInputTypeAttribute;
  fullWidth?: boolean;
  errorMsgRender?: ErrorMessageFn;
}

export interface RegisteredFieldProps<Type extends FieldValues> extends FieldProps<Type> {
  register?: UseFormRegister<Type>;
  control?: Control<any>;
  registerName: Path<Type>;
  name?: string;
}

export type HookFormFieldProps<
  T extends FieldValues,
  OriginProps extends Record<string, any>,
  OptionalProps extends Record<string, any> | unknown = unknown> =
  OriginProps & RegisteredFieldProps<T> & OptionalProps;

export type HookFormFieldComponent<Props extends FieldValues> = React.FunctionComponent<Props>;
