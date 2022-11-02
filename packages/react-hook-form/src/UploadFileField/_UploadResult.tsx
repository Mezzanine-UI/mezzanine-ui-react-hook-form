/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { UploadResult, UploadResultProps } from '@mezzanine-ui/react';
import axios from 'axios';
import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { UseUploadHandlersProps } from '../UploadImageField';

export interface _UploadResultProps extends Omit<UploadResultProps, 'status' | 'percentage'> {
  file: File;
  registerName: string;
  url: string;
  bearerToken?: string;
  formDataName?: string;
  formDataFileName?: string;
  hide?: boolean;
  disabledUpload?: boolean;
  resolve: UseUploadHandlersProps['resolve'];
}

const _UploadResult: FC<_UploadResultProps> = ({
  url,
  file,
  registerName,
  bearerToken,
  formDataName = 'file',
  formDataFileName = 'fileName',
  resolve,
  hide = false,
  onDelete: onDeleteProp,
  disabledUpload = false,
  style,
  name,
  ...props
}) => {
  const { setValue } = useFormContext();
  const value = useWatch({ name: registerName });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<UploadResultProps['status']>(
    typeof value === 'undefined' && !disabledUpload ? 'loading' : 'done',
  );

  const doUpload = useCallback(
    async () => {
      try {
        const Authorization = bearerToken?.replace(/^Bearer\s/, '')
          ? `Bearer ${bearerToken}`
          : '';

        const formData = new FormData();

        formData.append(formDataFileName, name || file.name);
        formData.append(formDataName, new Blob([file], { type: file.type }));

        const { data } = await axios.post(
          url,
          formData,
          {
            headers: {
              Authorization,
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent: any) => {
              const progressPercentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );

              setProgress(progressPercentage);
            },
          },
        );

        setValue(registerName, resolve(data, file));
        setStatus('done');
        return true;
      } catch (e: any) {
        setValue(registerName, null);
        setStatus('error');
        return false;
      }
    },
    [url],
  );

  const onDelete = (e: React.MouseEvent) => {
    setValue(registerName, undefined);
    onDeleteProp?.(e);
  };

  useEffect(() => {
    if (typeof value === 'undefined' && !disabledUpload) {
      doUpload();
    }
  }, [value]);

  return (
    <UploadResult
      {...props}
      name={name || file.name}
      status={status}
      percentage={progress}
      onDelete={onDelete}
      style={{
        ...style,
        ...(hide ? { display: 'none' } : undefined),
      }}
    />
  );
};

export default _UploadResult;
