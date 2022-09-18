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
      style={{ width: '100%' }}
    >
      <FormFieldsWrapper
        methods={methods}
      >
        <FormFieldsDebug mode="dev" />
        <UploadImageField
          width={200}
          bearerToken="you authorization header"
          url="http://localhost:3333/graphql/file/upload"
          formDataName="file"
          resolve={(res: MockUploadResponse) => res.id + res.whatever} // Will update form filed value
          label="Label Name"
          registerName="upload-image-register-name-1"
          aspect={1} // To limit the cropped aspect ratio.
        />
        <br />
        <br />
        <p>
          fullWidth
          <br />
          aspect-ratio = 16/9
        </p>
        <UploadImageField
          fullWidth
          bearerToken="you authorization header"
          url="http://localhost:3333/graphql/file/upload-2"
          resolve={(res: MockUploadResponse) => res.id + res.whatever} // Will update form filed value
          formDataName="file"
          label="Label Name"
          registerName="upload-image-register-name"
          aspect={16 / 9} // To limit the cropped aspect ratio.
        />
        <br />
        <br />
        <p>
          width = 200 (higher priority)
          <br />
          fullWidth
          <br />
          aspect-ratio = 16/9
        </p>
        <UploadImageField
          fullWidth
          width={200}
          bearerToken="you authorization header"
          url="http://localhost:3333/graphql/file/upload-2"
          resolve={(res: MockUploadResponse) => res.id + res.whatever} // Will update form filed value
          formDataName="file"
          label="Label Name"
          registerName="upload-image-register-name"
          aspect={16 / 9} // To limit the cropped aspect ratio.
        />
        <br />
        <br />
        <p>
          fullWidth
          <br />
          aspect-ratio = 4/3
        </p>
        <UploadImageField
          fullWidth
          bearerToken="you authorization header"
          formDataName="file"
          url="http://localhost:3333/graphql/file/upload-3"
          resolve={(res: MockUploadResponse) => res.id + res.whatever} // Will update form filed value
          label="Label Name"
          registerName="upload-image-register-name"
          aspect={4 / 3} // To limit the cropped aspect ratio.
          annotation={{
            formats: ['jpeg', 'webp'],
            maximumMb: 10,
            recommendedText: '建議尺寸：寬度至少 1600px，高度不限',
            others: ['whatever', 'you', 'gonna', 'insert'],
          }}
        />
      </FormFieldsWrapper>
    </div>
  );
};
