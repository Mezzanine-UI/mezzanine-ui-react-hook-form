import { CalendarConfigProvider, Message } from '@mezzanine-ui/react';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { useForm } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import DateRangePickerField from './DateRangePickerField';

export default {
  title: 'Data Display/DateRangePickerField',
};

export const Basic = () => {
  const methods = useForm();

  return (
    <div
      style={{ width: '100%', maxWidth: '680px' }}
    >
      <CalendarConfigProvider
        methods={CalendarMethodsMoment}
      >
        <FormFieldsWrapper
          methods={methods}
        >
          <FormFieldsDebug mode="dev" />
          <DateRangePickerField
            width={300}
            label="Label Name"
            size="large"
            registerName="date-range-picker-register-name"
            placeholder="YYYY - MM - DD"
            format="YYYY - MM - DD"
            remark="YYYY - MM - DD"
          />
          <br />
          <br />
          <DateRangePickerField
            width={300}
            label="Test onChange"
            size="large"
            registerName="date-range-picker-register-name-2"
            placeholder="YYYY - MM - DD"
            format="YYYY - MM - DD"
            remark="YYYY - MM - DD"
            onChange={(next) => Message.success(next)}
          />
        </FormFieldsWrapper>
      </CalendarConfigProvider>
    </div>
  );
};
