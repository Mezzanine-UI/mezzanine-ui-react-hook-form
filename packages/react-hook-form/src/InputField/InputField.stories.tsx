/* eslint-disable react-hooks/exhaustive-deps */
import { Message } from '@mezzanine-ui/react';
import { FC, useEffect, useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import InputField from './InputField';

export default {
  title: 'Data Display/InputField',
};

export const Basic = () => {
  const methods = useForm();

  const DispatchValue5After3s5s: FC = useMemo(() => () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { setValue } = useFormContext();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setTimeout(() => {
        setValue('dispatch-input-register-name-5', '123');
      }, 3000);
      setTimeout(() => {
        setValue('dispatch-input-register-name-5', '456');
      }, 5000);
    }, []);

    return null;
  }, []);

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
          registerName="input-register-name-1"
        />
        <br />
        <br />
        <InputField
          width={300}
          label="Label Name"
          size="large"
          registerName="input-register-name-2"
        />
        <br />
        <br />
        <InputField
          valueAsNumber
          width={300}
          label="Value As Number"
          size="large"
          registerName="input-register-name-3"
        />
        <br />
        <br />
        <InputField
          width={300}
          label="Test onChange"
          size="large"
          registerName="input-register-name-4"
          onChange={(e) => Message.success(e.target.value)}
        />
        <br />
        <br />
        <p>Will Dispatch after 3s and 5s</p>
        <InputField
          width={300}
          label="Test setValue"
          size="large"
          registerName="dispatch-input-register-name-5"
        />
        <DispatchValue5After3s5s />
        <br />
        <br />
        <p>Test defaultValue</p>
        <InputField
          width={300}
          label="Test defaultValue"
          size="large"
          registerName="dispatch-input-register-name-6"
          defaultValue="defaultValue"
        />
        <DispatchValue5After3s5s />
        <br />
        <br />
        <p>Test reset</p>
        <InputField
          width={300}
          label="Test reset logic"
          size="large"
          registerName="reset-testing"
          defaultValue="defaultValue"
        />
        <button type="button" onClick={() => methods.reset()}>
          reset
        </button>
      </FormFieldsWrapper>
    </div>
  );
};
