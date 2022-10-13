import { useForm } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import DefaultValueField from './DefaultValueField';

export default {
  title: 'Data Display/DefaultValueField',
};

export const Basic = () => {
  const methods = useForm();

  return (
    <div
      style={{ width: '100%' }}
    >
      <FormFieldsWrapper
        methods={methods}
      >
        <FormFieldsDebug mode="dev" />
        <DefaultValueField
          registerName="defaulting-value-only"
          defaultValue={1}
        />
      </FormFieldsWrapper>
    </div>
  );
};
