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
  hide?: boolean;
  resolve: UseUploadHandlersProps['resolve'];
}

const _UploadResult: FC<_UploadResultProps> = ({
  url,
  file,
  registerName: registerNameProp,
  bearerToken,
  formDataName = 'file',
  resolve,
  hide = false,
  onDelete: onDeleteProp,
  ...props
}) => {
  const { setValue } = useFormContext();
  const registerName = `${registerNameProp}.${file.name.split('.')?.[0]}`;
  const value = useWatch({ name: registerName });
  const [status, setStatus] = useState<UploadResultProps['status']>(typeof value === 'undefined' ? 'loading' : 'done');
  const [progress, setProgress] = useState(0);

  const doUpload = useCallback(
    async () => {
      try {
        const Authorization = bearerToken?.replace(/^Bearer\s/, '')
          ? `Bearer ${bearerToken}`
          : '';

        const formData = new FormData();

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
    if (typeof value === 'undefined') {
      doUpload();
    }
  }, [value]);

  return (
    <UploadResult
      {...props}
      name={file.name}
      status={status}
      percentage={progress}
      onDelete={onDelete}
      style={hide ? { display: 'none' } : undefined}
    />
  );
};

export default _UploadResult;
