import { useForm } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import UploadImageField from './UploadImageField';

export default {
  title: 'Data Display/UploadImageField',
};

export const Basic = () => {
  const methods = useForm();

  type MockUploadResponse = {
    id: '123',
    whatever: 'depends on your server dto',
  };

  return (
    <div
      style={{ width: '100%', maxWidth: '1000px' }}
    >
      <FormFieldsWrapper
        methods={methods}
      >
        <FormFieldsDebug mode="dev" />
        <UploadImageField
          bearerToken="you authorization header"
          url="http://localhost:3333/graphql/file/upload"
          resolve={(res: MockUploadResponse) => res.id + res.whatever} // Will update form filed value
          label="Label Name"
          registerName="upload-image-register-name"
          aspect={1} // To limit the cropped aspect ratio.
        />
      </FormFieldsWrapper>
    </div>
  );
};
