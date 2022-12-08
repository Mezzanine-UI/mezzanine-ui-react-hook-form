import { Message } from '@mezzanine-ui/react';
import { useForm } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import RangeSliderField from './RangeSliderField';

export default {
  title: 'Data Display/RangeSliderField',
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
        <RangeSliderField
          label="Label Name"
          registerName="range-slider-register-name"
        />
        <br />
        <br />
        <RangeSliderField
          label="Test onChange"
          registerName="range-slider-register-name-2"
          onChange={(next) => Message.success(JSON.stringify(next))}
        />
      </FormFieldsWrapper>
    </div>
  );
};
