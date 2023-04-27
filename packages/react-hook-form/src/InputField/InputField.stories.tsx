/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { Message } from '@mezzanine-ui/react';
import { FC, useEffect, useMemo } from 'react';
import {
  useForm, useFormContext, useFormState,
} from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import InputField from './InputField';

export default {
  title: 'Data Display/InputField',
};

export const Basic = () => {
  const methods = useForm({
    defaultValues: {
      'reset-testing': 'reset-testing',
    },
  });

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

  const methods2 = useForm({
    defaultValues: {
      nameA: 'hihi',
      nameB: 'hihi',
    },
  });

  const methods3 = useForm({
    defaultValues: {
      nameC: '',
    },
    mode: 'onChange',
  });

  const { isValid: method3IsValid } = useFormState({ control: methods3.control });

  const methods4 = useForm({
    defaultValues: {
      nameD: '',
    },
    mode: 'onBlur',
  });

  const { isValid: method4IsValid } = useFormState({ control: methods4.control });

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
        />
        <button type="button" onClick={() => methods.reset()}>
          reset
        </button>

        <br />
        <br />
        <p>Test prop onChange</p>
        <InputField
          registerName="test-prop-on-change"
          onChange={(e) => Message.success(e.target.value)}
        />

        <br />
        <br />
        <p>Test prop onFocus</p>
        <InputField
          registerName="test-prop-on-focus"
          onFocus={() => Message.success('onFocus')}
        />
        <br />
        <br />
        <p>Test prop onBlur</p>
        <InputField
          registerName="test-prop-on-blur"
          onBlur={() => Message.success('onBlur')}
        />
      </FormFieldsWrapper>

      <br />
      <br />
      <p>Test default disabled</p>
      <FormFieldsWrapper methods={methods2}>
        <div style={{ color: 'black' }}>{`${methods2.formState.isDirty}`}</div>
        <div style={{ color: 'black' }}>{`${methods2.formState.isDirty}`}</div>
        <div style={{ color: 'black' }}>{`${JSON.stringify(methods2.formState.touchedFields, null, 2)}`}</div>
        <div style={{ color: 'black' }}>{`${JSON.stringify(methods2.formState.dirtyFields, null, 2)}`}</div>
        <InputField registerName="nameA" />
        <InputField registerName="nameB" disabled />
      </FormFieldsWrapper>

      <br />
      <br />
      <p>Test mode = onChange</p>
      <FormFieldsWrapper methods={methods3}>
        <InputField
          required
          registerName="nameC"
        />
        method3IsValid =
        {method3IsValid ? 'true' : 'false'}
      </FormFieldsWrapper>

      <br />
      <br />
      <p>Test mode = onBlur</p>
      <FormFieldsWrapper methods={methods4}>
        <InputField
          required
          registerName="nameD"
        />
        method4IsValid =
        {method4IsValid ? 'true' : 'false'}

      </FormFieldsWrapper>
    </div>
  );
};
