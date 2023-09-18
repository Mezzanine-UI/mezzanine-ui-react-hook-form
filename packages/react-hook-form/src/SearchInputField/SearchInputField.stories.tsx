import { Message } from '@mezzanine-ui/react';
import { FC, useMemo } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import SearchInputField from './SearchInputField';

export default {
  title: 'Data Display/SearchInputField',
};

export const Basic = () => {
  const methods = useForm({
    defaultValues: {
      'test-default-is-undefined': undefined,
    },
  });

  // eslint-disable-next-line react/no-unstable-nested-components
  const Watcher = useMemo<FC>(() => () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { watch } = useFormContext();
    return <p>{watch('search-watcher')}</p>;
  }, []);

  return (
    <div
      style={{ width: '100%', maxWidth: '680px' }}
    >
      <FormFieldsWrapper
        methods={methods}
      >
        <FormFieldsDebug mode="dev" />
        <p>
          Keyword default debouncing = 500ms
        </p>
        <SearchInputField
          width={300}
          label="Label Name"
          size="large"
          registerName="search-input-register-name-1"
        />
        <br />
        <br />
        <p>
          Keyword debouncing = 800ms
        </p>
        <SearchInputField
          width={300}
          debounceMs={800}
          label="Label Name"
          size="large"
          registerName="search-input-register-name-2"
        />
        <br />
        <br />
        <p>
          Keyword debouncing = 1200ms
        </p>
        <SearchInputField
          width={300}
          debounceMs={1200}
          label="Value As Number"
          size="large"
          registerName="search-input-register-name-3"
        />
        <br />
        <br />
        <p>
          debounced = false
        </p>
        <SearchInputField
          width={300}
          debounced={false}
          label="Value As Number"
          size="large"
          registerName="search-input-register-name-4"
        />
        <p>
          Test onChange
        </p>
        <SearchInputField
          width={300}
          label="Test onChange"
          size="large"
          registerName="search-input-register-name-5"
          onChange={(e) => Message.success?.(e.target.value)}
        />
        <p>
          Test Watcher
        </p>
        <SearchInputField
          width={300}
          label="Test onChange"
          size="large"
          registerName="search-watcher"
        />
        <Watcher />
        <p>
          Test reset ui binding as (defaultValue = undefined)
        </p>
        <SearchInputField
          width={300}
          label="Test Default Is undefined"
          size="large"
          registerName="test-default-is-undefined"
        />
        <button
          aria-label="reset-test-default-is-undefined"
          type="button"
          onClick={() => methods.reset()}
        >
          Reset Default is undefined
        </button>
      </FormFieldsWrapper>
    </div>
  );
};
