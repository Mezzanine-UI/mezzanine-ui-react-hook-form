import { Message } from '@mezzanine-ui/react';
import { useForm, useFormState } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import SelectField from './SelectField';

export default {
  title: 'Data Display/SelectField',
};

export const Single = () => {
  const methods = useForm();

  return (
    <div
      style={{ width: '100%', maxWidth: '680px' }}
    >
      <FormFieldsWrapper
        methods={methods}
      >
        <FormFieldsDebug
          title="Form State Monitor"
          mode="dev"
        />
        <SelectField
          label="Single Select Label Name"
          registerName="single-select-register-name"
          options={[
            {
              id: '1',
              name: '1',
            },
            {
              id: '2',
              name: '2',
            },
            {
              id: '3',
              name: '3',
            },
          ]}
        />
        <br />
        <br />
        <SelectField
          label="Single Group Select Label Name"
          registerName="single-group-select-register-name"
          optionGroups={[
            {
              label: '1',
              options: [{
                id: '1',
                name: '2',
              }],
            },
            {
              label: '2',
              options: [{
                id: '2',
                name: '3',
              }],
            },
          ]}
        />
      </FormFieldsWrapper>
    </div>
  );
};

export const Multiple = () => {
  const methods = useForm({
    defaultValues: {
      'multiple-group-select-register-nam-2': [],
    },
  });
  const { isDirty } = useFormState({ name: 'multiple-group-select-register-nam-2', control: methods.control });

  return (
    <div
      style={{ width: '100%', maxWidth: '680px' }}
    >
      <FormFieldsWrapper
        methods={methods}
      >
        <FormFieldsDebug
          title="Form State Monitor"
          mode="dev"
        />
        <SelectField
          width={300}
          mode="multiple"
          label="Multiple Select Label Name"
          registerName="multiple-select-register-name"
          options={[
            {
              id: '1',
              name: '1',
            },
            {
              id: '2',
              name: '2',
            },
            {
              id: '3',
              name: '3',
            },
          ]}
        />
        <br />
        <br />
        <SelectField
          width={300}
          mode="multiple"
          label="Multiple Group Select Label Name"
          registerName="multiple-group-select-register-name"
          optionGroups={[
            {
              label: '1',
              options: [{
                id: '1',
                name: '2',
              }],
            },
            {
              label: '2',
              options: [{
                id: '2',
                name: '3',
              }],
            },
          ]}
        />
        <br />
        <br />
        <SelectField
          width={300}
          mode="multiple"
          label="Test onChange"
          registerName="multiple-group-select-register-nam-2"
          onChange={(nextOptions) => Message?.success(JSON.stringify(nextOptions))}
          optionGroups={[
            {
              label: '1',
              options: [{
                id: '1',
                name: '2',
              }],
            },
            {
              label: '2',
              options: [{
                id: '2',
                name: '3',
              }],
            },
          ]}
        />
        <br />
        <br />
        multiple-group-select-register-nam-2 is dirty =
        {isDirty ? 'true' : 'false'}
      </FormFieldsWrapper>
    </div>
  );
};
