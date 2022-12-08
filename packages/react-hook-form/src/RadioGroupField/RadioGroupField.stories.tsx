import { Message } from '@mezzanine-ui/react';
import { FC, useEffect, useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import RadioGroupField from './RadioGroupField';

export default {
  title: 'Data Display/RadioGroupField',
};

export const Basic = () => {
  const methods = useForm({
    defaultValues: {
      'radio-group-register-name-3': 'value 3',
    },
  });

  const DispatchValue3After3s: FC = useMemo(() => () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { setValue } = useFormContext();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setTimeout(() => {
        setValue('radio-group-register-name-3', 'value 2');
      }, 3000);
    }, [setValue]);

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
        <RadioGroupField
          label="Label Name"
          size="large"
          registerName="radio-group-register-name"
          options={[
            {
              value: 'value 1',
              label: 'label 1',
            },
            {
              value: 'value 2',
              label: 'label 2',
            },
            {
              value: 'value 3',
              label: 'label 3',
            },
          ]}
        />
        <br />
        <br />
        <RadioGroupField
          label="Label Name"
          size="large"
          registerName="radio-group-register-name-2"
          defaultValue="value 2"
          options={[
            {
              value: 'value 1',
              label: 'label 1',
            },
            {
              value: 'value 2',
              label: 'label 2',
            },
            {
              value: 'value 3',
              label: 'label 3',
            },
          ]}
        />
        <br />
        <br />
        <DispatchValue3After3s />
        <RadioGroupField
          label="Label Name"
          size="large"
          registerName="radio-group-register-name-3"
          defaultValue="value 1"
          options={[
            {
              value: 'value 1',
              label: 'label 1',
            },
            {
              value: 'value 2',
              label: 'label 2',
            },
            {
              value: 'value 3',
              label: 'label 3',
            },
          ]}
        />
        <br />
        <br />
        <RadioGroupField
          label="Test onChange"
          size="large"
          registerName="radio-group-register-name-4"
          defaultValue="value 1"
          onChange={(e) => Message.success(e.target.value)}
          options={[
            {
              value: 'value 1',
              label: 'label 1',
            },
            {
              value: 'value 2',
              label: 'label 2',
            },
            {
              value: 'value 3',
              label: 'label 3',
            },
          ]}
        />
      </FormFieldsWrapper>
    </div>
  );
};
