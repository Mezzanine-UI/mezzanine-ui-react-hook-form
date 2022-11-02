import { useForm } from 'react-hook-form';
import { FormFieldsDebug } from '../FormFieldsDebug';
import { FormFieldsWrapper } from '../FormFieldsWrapper';
import { UploadFileField } from './UploadFileField';

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
          formDataFileName="fileName"
          size="large"
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
        <br />
        <UploadFileField
          width={200}
          hideUploadResults
          name="123"
          label="Label Name"
          registerName="upload-image-register-name-2"
          bearerToken="your bearer token"
          url="http://localhost:3003/file/image/upload"
          remark="建議尺寸：1920 x 1080以上（圖像比例為 8:5）"
          formDataName="file"
          formDataFileName="fileName"
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
        <br />
        <p>with defaultValue (name and url)</p>
        <UploadFileField
          width={200}
          name="123"
          label="Label Name"
          registerName="upload-image-register-name-3"
          bearerToken="your bearer token"
          url="http://localhost:3003/file/image/upload"
          remark="建議尺寸：1920 x 1080以上（圖像比例為 8:5）"
          formDataName="file"
          formDataFileName="fileName"
          size="small"
          uploadButton={{
            multiple: true,
            variant: 'outlined',
            size: 'large',
          }}
          defaultValue={[
            {
              name: '494967d3304e509b462e365c920283184386d24d.png',
              url: 'https://static-tast.rytass.info/494967d3304e509b462e365c920283184386d24d.png',
            },
            {
              name: 'e192dd70f4d28a8ca735e3236a50e57bf5d947b2.jpeg',
              url: 'https://static-tast.rytass.info/e192dd70f4d28a8ca735e3236a50e57bf5d947b2.jpeg',
            },
          ]}
          defaultResolve={(data, originFile) => ({
            response: data,
            originFile,
          })}
          resolve={(res: MockUploadResponse, originFile: File) => ({
            response: res,
            originFile,
          })} // Will update form filed value
        />
        <br />
        <p>with defaultValue (url)</p>
        <UploadFileField
          width={200}
          name="123"
          label="Label Name"
          registerName="upload-image-register-name-4"
          bearerToken="your bearer token"
          url="http://localhost:3003/file/image/upload"
          remark="建議尺寸：1920 x 1080以上（圖像比例為 8:5）"
          formDataName="file"
          formDataFileName="fileName"
          size="medium"
          uploadButton={{
            multiple: true,
            variant: 'outlined',
            size: 'large',
          }}
          defaultValue={[
            'https://static-tast.rytass.info/494967d3304e509b462e365c920283184386d24d.png',
            'https://static-tast.rytass.info/e192dd70f4d28a8ca735e3236a50e57bf5d947b2.jpeg',
          ]}
          defaultResolve={(data, originFile) => ({
            response: data,
            originFile,
          })}
          resolve={(res: MockUploadResponse, originFile: File) => ({
            response: res,
            originFile,
          })} // Will update form filed value
        />
        <br />
        <p>with defaultValue (file)</p>
        <UploadFileField
          width={200}
          name="123"
          label="Label Name"
          registerName="upload-image-register-name-5"
          bearerToken="your bearer token"
          url="http://localhost:3003/file/image/upload"
          remark="建議尺寸：1920 x 1080以上（圖像比例為 8:5）"
          formDataName="file"
          formDataFileName="fileName"
          size="large"
          uploadButton={{
            multiple: true,
            variant: 'outlined',
          }}
          defaultValue={[
            new File([], '123.jpeg', { type: 'image/jpeg' }),
            new File([], '456.jpeg', { type: 'image/jpeg' }),
          ]}
          defaultResolve={(data, originFile) => ({
            response: data,
            originFile,
          })}
          fileRegisterName={(file, key) => `客製的Key:${file.name}:${key}`}
          resolve={(res: MockUploadResponse, originFile: File) => ({
            response: res,
            originFile,
          })} // Will update form filed value
        />
      </FormFieldsWrapper>
    </div>
  );
};
