import { ReactNode } from 'react';
import { MultipleFieldErrors } from 'react-hook-form';

export type ErrorMessageFn = (data: {
  message: string;
  messages?: MultipleFieldErrors | undefined;
}) => ReactNode;
