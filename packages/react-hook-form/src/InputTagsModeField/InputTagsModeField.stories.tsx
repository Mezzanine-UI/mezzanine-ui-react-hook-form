import { Message } from '@mezzanine-ui/react';
import { useForm } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import InputTagsModeField from './InputTagsModeField';

export default {
  title: 'Data Display/InputTagsModeField',
};

export const Basic = () => {
  const methods = useForm({
    defaultValues: {
      'input-tags-mode-register-name-1': ['123', '234'],
    },
  });

  return (
    <div
      style={{ width: '100%', maxWidth: '680px' }}
    >
      <FormFieldsWrapper
        methods={methods}
      >
        <FormFieldsDebug mode="dev" />
        <InputTagsModeField
          width={300}
          label="Label Name"
          size="large"
          registerName="input-tags-mode-register-name-1"
          maxTagsLength={5}
        />
        <br />
        <br />
        <p>
          maxTagsLength = 8
        </p>
        <InputTagsModeField
          width={300}
          maxTagsLength={8}
          label="Max Tags Length"
          size="large"
          registerName="input-tags-mode-register-name-2"
        />
        <br />
        <br />
        <p>
          maxLength = 2
        </p>
        <InputTagsModeField
          width={300}
          label="Max Length"
          size="large"
          maxLength={2}
          registerName="input-tags-mode-register-name-3"
        />
        <br />
        <br />
        <InputTagsModeField
          width={300}
          label="Test onChange"
          size="large"
          maxLength={2}
          registerName="input-tags-mode-register-name-4"
          onTagsChange={(newTags) => Message.success(JSON.stringify(newTags))}
        />
      </FormFieldsWrapper>
    </div>
  );
};
