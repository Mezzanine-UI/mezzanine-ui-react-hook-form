import { Message } from '@mezzanine-ui/react';
import { useCallback } from 'react';
import { of, switchMap } from 'rxjs';
import { FieldValues, Path, UseFormSetValue } from 'react-hook-form';
import { byteToMegaByte, megaByteToByte, readFile } from '../utils/file';
import { UploadStatus } from './../typings/file';

type AsyncAnyFunction = (...args: any[]) => Promise<any>;
export interface UseUploadHandlersProps<U extends AsyncAnyFunction = AsyncAnyFunction> {
  url: string,
  bearerToken?: string;
  fileExtensions?: string[];
  registerName: Path<any>;
  sizeLimit?: number;
  formDataName?: string;
  upload: U;
  setCropperOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setImageSrc?: React.Dispatch<React.SetStateAction<string>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setStatus?: React.Dispatch<React.SetStateAction<UploadStatus>>;
  setValue: UseFormSetValue<FieldValues>;
  resolve(res: any, originalFile?: File): any,
}

export const useUploadHandlers = ({
  fileExtensions,
  registerName,
  sizeLimit,
  upload,
  setCropperOpen,
  setImageSrc,
  setProgress,
  setStatus,
  setValue,
}: UseUploadHandlersProps) => {
  const handleFileGuard = useCallback((file: File): boolean => {
    const checkFileSize = () => {
      Message.info?.(`上傳檔案大小：${byteToMegaByte(file.size).toFixed(1)} Mb`);

      if (file.size < megaByteToByte(sizeLimit || Infinity)) return true;

      Message.error?.('檔案大小超過限制');

      return false;
    };

    const checkFileExtension = () => {
      if (Array.isArray(fileExtensions)) {
        const someFileAcceptExtension = fileExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

        if (someFileAcceptExtension) return true;

        Message.error?.('檔案格式不支援');

        return false;
      }

      return true;
    };

    return (checkFileSize() && checkFileExtension());
  }, [sizeLimit]);

  const handleResetStatus = useCallback(() => {
    setTimeout(() => {
      setProgress(0);
      setStatus?.('ready');
    }, 1000);
  }, [setProgress, setStatus]);

  const handleFileToCrop = useCallback(
    async (file: File) => {
      try {
        if (!handleFileGuard(file)) return;
        const imageDataUrl = await readFile(file);

        setCropperOpen?.(true);
        setStatus?.('uploading');
        setImageSrc?.(String(imageDataUrl));
      } catch (e) {
        setStatus?.('error');
        handleResetStatus();
      }
    },
    [handleFileGuard, handleResetStatus, setCropperOpen, setImageSrc, setStatus],
  );

  const handleFileUpload: typeof upload = useCallback(
    async (...args) => {
      const upload$ = of(null).pipe(switchMap(() => upload(...args)));

      return new Promise((__resolve, __reject) => {
        upload$.subscribe({
          next: (resolvedValue) => {
            setValue(registerName, resolvedValue, { shouldValidate: true });
            setStatus?.('success');
            Message.success?.('上傳成功');
            handleResetStatus();
            __resolve(resolvedValue);
          },
          error: (ex) => {
            setValue(registerName, null, { shouldValidate: true });
            setStatus?.('error');
            Message.error(`[${ex?.message}] 上傳失敗`);
            __reject(ex);
          },
        });
      });
    },
    [handleResetStatus, upload],
  );

  return {
    handleFileToCrop,
    handleFileUpload,
  };
};
