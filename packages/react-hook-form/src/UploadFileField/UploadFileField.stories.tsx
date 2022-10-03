import { useForm } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import UploadFileField from './UploadFileField';

export default {
  title: 'Data Display/UploadFileField',
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
        <UploadFileField
          width={200}
          hideUploadButtonAsUploaded
          name="123"
          label="Label Name"
          registerName="upload-image-register-name-1"
          bearerToken="your bearer token"
          url="http://localhost:3003/file/image/upload"
          remark="建議尺寸：1920 x 1080以上（圖像比例為 8:5）"
          formDataName="file"
          size="small"
          uploadButton={{
            multiple: true,
            variant: 'outlined',
            size: 'large',
          }}
          resolve={(res: MockUploadResponse, originFile: File) => ({
            response: res,
            originFile,
          })} // Will update form filed value
        />
      </FormFieldsWrapper>
    </div>
  );
};
