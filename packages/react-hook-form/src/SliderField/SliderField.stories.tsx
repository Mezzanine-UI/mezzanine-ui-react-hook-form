import { Message } from '@mezzanine-ui/react';
import { useForm } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import SliderField from './SliderField';

export default {
  title: 'Data Display/SliderField',
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
        <SliderField
          label="Label Name"
          registerName="range-slider-register-name"
        />
        <br />
        <br />
        <SliderField
          label="Test onChange"
          registerName="range-slider-register-nam-2"
          onChange={(next) => Message?.success(next)}
        />
      </FormFieldsWrapper>
    </div>
  );
};
