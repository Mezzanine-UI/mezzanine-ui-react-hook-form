import { TimesCircleFilledIcon } from '@mezzanine-ui/icons';
import { Icon } from '@mezzanine-ui/react';
import { useCallback } from 'react';
import { Resolver, ResolverError, useForm } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import InputField from '../InputField/InputField';
import { ErrorMessageFn } from '../typings/error-message';

export default {
  title: 'Data Display/CustomErrorMessage',
};

export const Basic = () => {
  const customResolver: Resolver = useCallback((values) => ({
    errors: {
      field1: { message: 'field1 error', type: 'validate' },
      field2: { message: 'field2 error', type: 'validate' },
    },
    values,
  } as ResolverError<any>), []);

  /**
   * Custom your ErrorMessage layout.
   */
  const customErrorMsgRender1: ErrorMessageFn = useCallback<ErrorMessageFn>(({ message }) => (
    <div style={{ color: 'green' }}>
      <span>This is my custom error: </span>
      <span style={{ textTransform: 'uppercase' }}>{message}</span>
    </div>
  ), []);
  const customErrorMsgRender2: ErrorMessageFn = useCallback<ErrorMessageFn>(({ message }) => (
    <div style={{ color: 'purple', display: 'flex', alignItems: 'center' }}>
      <Icon icon={TimesCircleFilledIcon} />
      &nbsp;
      <span style={{ textTransform: 'uppercase' }}>{message}</span>
    </div>
  ), []);

  const methods = useForm({
    resolver: customResolver,
  });

  return (
    <div
      style={{ width: '100%', maxWidth: '680px' }}
    >
      <FormFieldsWrapper
        methods={methods}
      >
        <FormFieldsDebug mode="dev" />
        <InputField
          width={300}
          label="Label Name"
          size="large"
          registerName="field1"
          errorMsgRender={customErrorMsgRender1}
        />
        <br />
        <br />
        <InputField
          width={300}
          label="Label Name"
          size="large"
          registerName="field2"
          errorMsgRender={customErrorMsgRender2}
        />
        <br />
        <br />
        <InputField
          valueAsNumber
          width={300}
          label="Value As Number"
          size="large"
          registerName="field3"
        />
        <button type="submit" style={{ display: 'none' }}>123</button>
      </FormFieldsWrapper>
    </div>
  );
};
