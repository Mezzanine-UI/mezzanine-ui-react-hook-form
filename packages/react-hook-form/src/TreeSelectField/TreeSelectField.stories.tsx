import { Message } from '@mezzanine-ui/react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import TreeSelectField from './TreeSelectField';

export default {
  title: 'Data Display/TreeSelectField',
};

export const Basic = () => {
  const methods = useForm();

  const treeSelectOptions = useMemo(() => [
    {
      id: '1',
      name: '1',
      siblings: [
        {
          id: '1-1',
          name: '1.1',
        },
        {
          id: '1-2',
          name: '1.2',
        },
      ],
    },
    {
      id: '2',
      name: '2',
    },
    {
      id: '3',
      name: '3',
    },
  ], []);

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
        <TreeSelectField
          clearable
          label="Label Name"
          registerName="select-register-name"
          mode="multiple"
          options={treeSelectOptions}
        />
        <br />
        <br />
        <TreeSelectField
          clearable
          label="Test onChange"
          registerName="select-register-name-2"
          mode="multiple"
          options={treeSelectOptions}
          onChange={(next) => Message?.success(JSON.stringify(next, null, 2))}
        />
      </FormFieldsWrapper>
    </div>
  );
};
