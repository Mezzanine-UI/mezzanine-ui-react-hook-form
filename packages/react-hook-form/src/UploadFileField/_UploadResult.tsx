/* eslint-disable no-async-promise-executor */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { UploadResult, UploadResultProps } from '@mezzanine-ui/react';
import axios from 'axios';
import React, {
  FC, useCallback, useEffect, useMemo, useState,
} from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { lastValueFrom, of, switchMap } from 'rxjs';
import { useUploadHandlers, UseUploadHandlersProps } from '../UploadImageField';

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
  upload?(): Promise<any>;
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
  upload: uploadProp,
  name,
  ...props
}) => {
  const { setValue } = useFormContext();
  const value = useWatch({ name: registerName });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<UploadResultProps['status']>(
    typeof value === 'undefined' && !disabledUpload ? 'loading' : 'done',
  );

  const upload: _UploadResultProps['upload'] = useMemo(() => uploadProp || (() => new Promise(async (_resolve, _reject) => {
    try {
      const Authorization = bearerToken?.replace(/^Bearer\s/, '')
        ? `Bearer ${bearerToken}`
        : '';

      const formData = new FormData();

      formData.append(formDataFileName, name || file.name);
      formData.append(formDataName, new Blob([file], { type: file.type }), name || file.name);

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

      _resolve(resolve(data, file));
    } catch (e: any) {
      _reject(e);
    }
  })), [url]);

  const { handleFileUpload } = useUploadHandlers({
    url,
    bearerToken,
    registerName,
    formDataName,
    setProgress,
    setValue,
    resolve,
    upload,
  });

  const upload$ = useMemo(() => (
    of(null).pipe(switchMap(() => handleFileUpload()))
  ), [handleFileUpload]);

  const doUpload = useCallback(
    () => lastValueFrom(upload$).then(() => setStatus('done')).catch(() => setStatus('error')),
    [upload$],
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
