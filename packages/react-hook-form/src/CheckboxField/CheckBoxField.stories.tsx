import { Message } from '@mezzanine-ui/react';
import { useForm } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import CheckboxField from './CheckboxField';

export default {
  title: 'Data Display/CheckBoxField',
};

export const Basic = () => {
  const methods = useForm();

  return (
    <div
      style={{ width: '100%', maxWidth: '680px' }}
    >
      <FormFieldsWrapper
        methods={methods}
      >
        <FormFieldsDebug mode="dev" />
        <CheckboxField
          label="Label Name"
          registerName="checkbox-register-name-1"
          color="text-secondary"
        />
        <br />
        <br />

        <div>
          labelSpacing = true
        </div>
        <CheckboxField
          labelSpacing
          label="For some layouts we need top-spacing."
          registerName="checkbox-register-name-2"
          color="text-secondary"
        />
        <br />
        <br />

        <div>
          defaultChecked = true
          label = undefined
        </div>
        <CheckboxField
          defaultChecked
          registerName="checkbox-register-name-3"
          color="text-secondary"
        />
        <br />
        <br />

        <div>
          Test onChange
        </div>
        <CheckboxField
          registerName="checkbox-register-name-4"
          color="text-secondary"
          onChange={(e) => Message.success(e.target.value)}
        />
        <CheckboxField
          registerName="checkbox-register-name-5"
          color="text-secondary"
          label={<div>123</div>}
        />
      </FormFieldsWrapper>
    </div>
  );
};
