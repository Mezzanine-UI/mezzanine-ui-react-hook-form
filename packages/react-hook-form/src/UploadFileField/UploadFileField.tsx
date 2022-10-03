/* eslint-disable react-hooks/exhaustive-deps */
import {
  Typography, UploadButton, UploadButtonProps, UploadResultProps,
} from '@mezzanine-ui/react';
import { isNil, isString } from 'lodash';
import { useCallback, useState } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { BaseField } from '../BaseField';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import { UseUploadHandlersProps } from '../UploadImageField';
import UploadResult from './_UploadResult';

export type UploadFileFieldProps = HookFormFieldProps<FieldValues, Omit<UploadResultProps, 'status' | 'name'>, {
  url: string;
  bearerToken?: string;
  small?: boolean;
  formDataName?: string;
  gap?: number;
  width?: number;
  height?: number;
  uploadButton?: UploadButtonProps;
  uploadButtonLabel?: string;
  hideUploadButtonAsUploaded?: boolean;
  resolve: UseUploadHandlersProps['resolve'];
}>;

const UploadFileField: HookFormFieldComponent<UploadFileFieldProps> = ({
  registerName,
  resolve,
  url,
  bearerToken,
  width,
  formDataName = 'file',
  fullWidth,
  className,
  gap = 16,
  required,
  uploadButton,
  uploadButtonLabel = '上傳',
  remark,
  size,
  hideUploadButtonAsUploaded = false,
  label,
  errorMsgRender,
  ...props
}) => {
  const { formState } = useFormContext();
  const [files, setFiles] = useState<(File | undefined)[]>([]);

  const onUpload = useCallback(
    async (fs: File[]) => {
      setFiles((prev) => [...prev, ...fs]);
    },
    [setFiles],
  );

  const onDelete = useCallback((file: File) => {
    setFiles((prev) => prev.filter((f) => f !== file));
  }, [setFiles]);

  const isEmpty = files.length === 0;

  return (
    <BaseField
      disabledErrMsg
      fullWidth={width ? undefined : fullWidth}
      className={className}
      label={label}
      name={registerName}
      required={required}
      errors={formState.errors}
      errorMsgRender={errorMsgRender}
    >
      {(!hideUploadButtonAsUploaded || isEmpty) && (
        <UploadButton
          {...uploadButton}
          onUpload={onUpload}
        >
          {uploadButtonLabel}
        </UploadButton>
      )}
      {files.map((file, index) => (
        !!file && (
          <UploadResult
            {...props}
            size={size}
            key={file.name}
            resolve={resolve}
            url={url}
            name={file.name}
            formDataName={formDataName}
            bearerToken={bearerToken}
            file={file}
            registerName={registerName}
            onDelete={() => onDelete(file)}
            style={{
              marginTop: index ? `${gap}px` : undefined,
              ...props.style,
            }}
          />
        )
      ))}
      {!isNil(remark) && (
        isString(remark) ? (
          <Typography
            color="text-secondary"
            variant="caption"
            style={{ display: 'block', marginTop: '8px' }}
          >
            {remark}
          </Typography>
        ) : remark
      )}
    </BaseField>
  );
};

export default UploadFileField;
