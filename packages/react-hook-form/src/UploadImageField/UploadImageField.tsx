/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-async-promise-executor */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  CheckIcon,
  TimesIcon,
  TrashIcon,
  UploadIcon,
} from '@mezzanine-ui/icons';
import {
  cx,
  Fade,
  Icon,
  IconProps,
  Message,
  Typography,
} from '@mezzanine-ui/react';
import { uploadImageFieldClasses } from '@mezzanine-ui/react-hook-form-core';
import { CssVarInterpolations } from '@mezzanine-ui/system/css';
import axios from 'axios';
import { concat, isString, uniq } from 'lodash';
import {
  ChangeEventHandler,
  DragEventHandler,
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FieldValues,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { BaseField } from '../BaseField';
import {
  CropperModal,
  CropperModalProps,
} from '../Mezzanine/CropperModal/CropperModal';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import { UploadStatus } from '../typings/file';
import {
  blobToUrl,
  byteToMegaByte,
  fileListToArray,
  preprocessImg,
} from '../utils';
import { gcd } from '../utils/gcd';
import { useDefaultValue } from '../utils/use-default-value';
import {
  useUploadHandlers,
  UseUploadHandlersProps,
} from './use-upload-handlers';

const BASE_ACCEPT_FILE_EXTENSION = ['.jpg', '.jpeg', '.png'];

export type UploadImageFieldProps = HookFormFieldProps<
  FieldValues,
  {
    url: string;
    bearerToken?: string;
    acceptFileExtensions?: string[];
    border?: boolean;
    aspect?: number;
    dimensionLimit?: number[];
    sizeLimitMb?: number;
    typeHint?: boolean;
    small?: boolean;
    size?: number;
    formDataName?: string;
    width?: number;
    icon?: IconProps;
    text?: string;
    height?: number;
    mimeType?: string;
    previewClassName?: string;
    crop?: boolean;
    compressLog?: boolean;
    cropperHeader?: CropperModalProps['header'];
    defaultValue?: string;
    resolve: UseUploadHandlersProps['resolve'];
    upload?(blob: string | Blob, fileName?: string): Promise<any>;
    previewBgSize?: 'auto' | 'contain' | 'cover' | 'initial';
    annotation?: {
      formats?: string[];
      recommendedDimension?: [number, number];
      recommendedText?: string;
      maximumMb?: number;
      others?: string[];
    };
    labels?: {
      /** @default 檔案最大限制： */
      fileLimitationPrefix?: string;
      /** @default 影像格式： */
      formatPrefix?: string;
      /** @default 建議尺寸：${w} x ${h} 以上 (圖像比例為 ${wR}:${hR}) */
      resolveRecommendedDimension?: (
        width: number,
        height: number,
        widthRatio: number,
        heightRatio: number,
      ) => string;
      /** @default 上傳 */
      upload?: string;
      /** @default 上傳錯誤 */
      error?: string;
      /** @default 成功 */
      success?: string;
      /** @default 失敗 */
      failed?: string;
    };
  }
>;

const UploadImageField: HookFormFieldComponent<UploadImageFieldProps> = ({
  url,
  text = '上傳影像',
  acceptFileExtensions = [],
  aspect,
  border = true,
  previewClassName,
  className,
  control,
  mimeType,
  crop = true,
  cropperHeader,
  disabled,
  height,
  bearerToken,
  label,
  register,
  resolve,
  registerName,
  remark,
  required,
  sizeLimitMb,
  small,
  style,
  width,
  annotation,
  fullWidth,
  icon,
  formDataName = 'file',
  previewBgSize = 'cover',
  defaultValue,
  upload: uploadProp,
  errorMsgRender,
  labels,
  compressLog = false,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register: contextRegister,
    setValue,
    clearErrors,
    control: contextControl,
  } = useFormContext();

  const watchValue: File | string = useWatch({
    control: contextControl,
    name: registerName as any,
    defaultValue,
  });

  const { errors } = useFormState({ control: control || contextControl });

  const registration = useMemo(
    () =>
      (register || contextRegister)(registerName, {
        required,
      }),
    [registerName, required],
  );

  const fileName = useRef('');
  const [dragActive, setDragActive] = useState(false);
  const [hover, setHover] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(
    isString(watchValue) ? watchValue : watchValue?.name || '',
  );
  const [preview, setPreview] = useState<string>(
    isString(watchValue) ? watchValue : watchValue?.name || '',
  );
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<UploadStatus>('ready');
  const [cropperOpen, setCropperOpen] = useState(false);

  const cssVars: CssVarInterpolations = {
    border: !border ? '0' : undefined,
    '--backgroundImage': `url("${preview}")`,
    '--progress': `${progress}%`,
    '--width': `${width ? `${width + (!border ? 4 : 0)}px` : '100%'}`,
    '--height': `${height ? `${height}px` : '100%'}`,
    '--aspect': `${aspect || 'unset'}`,
  };

  const handlePreview = (img: string) => setPreview(img);

  const acceptExtensions = useMemo(
    () => uniq(concat(BASE_ACCEPT_FILE_EXTENSION, acceptFileExtensions)),
    [acceptFileExtensions],
  );

  const upload: UseUploadHandlersProps['upload'] = useMemo(
    () =>
      uploadProp ||
      ((b, f) =>
        new Promise(async (_resolve, _reject) => {
          try {
            const Authorization = bearerToken?.replace(/^Bearer\s/, '')
              ? `Bearer ${bearerToken}`
              : '';

            const formData = new FormData();

            const uploadFile = new File([b], f || '', { type: 'image/jpeg' });

            Message.info?.(
              `檔案大小: ${byteToMegaByte(uploadFile.size).toFixed(1)} Mb`,
            );

            formData.append(formDataName, b, f);

            const { data } = await axios.post(url, formData, {
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
            });

            _resolve(resolve(data, uploadFile));
          } catch (e: any) {
            _reject(e);
          }
        })),
    [setProgress, bearerToken, formDataName],
  );

  const { handleFileToCrop, handleFileUpload } = useUploadHandlers({
    url,
    bearerToken,
    fileExtensions: acceptExtensions,
    registerName,
    sizeLimit: sizeLimitMb,
    formDataName,
    setCropperOpen,
    setImageSrc,
    setProgress,
    setStatus,
    setValue,
    resolve,
    upload,
  });

  const onDragEnter: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);

    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDragLeave: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);

      if (e.dataTransfer) {
        const [file] = fileListToArray(e.dataTransfer.files);

        if (!file) return;

        fileName.current = file.name;
        /** 如果 `sizeLimitMb` 未有提供，預設就是預處理成 10mb 以內的照片 */
        preprocessImg(file, sizeLimitMb || 10, { log: compressLog }).then(
          (compressedFile) => {
            if (crop) {
              handleFileToCrop(compressedFile);
            } else {
              const blob = new Blob([compressedFile], {
                type: compressedFile.type || 'image/jpeg',
              });

              handleFileUpload(blob, fileName.current).then((success) => {
                if (success) {
                  handlePreview(blobToUrl(blob));
                }
              });
            }
          },
        );
      }
    },
    [handleFileToCrop, errors, registerName, crop, sizeLimitMb, compressLog],
  );

  const onMouseEnter: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    setHover(true);
  }, []);

  const onMouseLeave: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    setHover(false);
  }, []);

  const resetStates = useCallback(() => {
    setImageSrc('');
    setPreview('');
    setStatus('ready');
    setProgress(0);
    setValue(registerName, undefined, { shouldValidate: true });
  }, []);

  const onClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const { current: $inputEl } = inputRef;

      if (!$inputEl) return;

      e.preventDefault();

      switch (status) {
        case 'success':
        case 'error':
          $inputEl.value = '';
          resetStates();
          break;
        default:
          $inputEl.value = '';
          $inputEl.click();
      }
    },
    [handleFileToCrop, status],
  );

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (errors?.[registerName]) clearErrors(registerName);

      const target = e.target as HTMLInputElement;

      if (target.files?.length) {
        const [file] = fileListToArray(target.files);

        if (!file) return;

        fileName.current = file.name;
        /** 如果 `sizeLimitMb` 未有提供，預設就是預處理成 10mb 以內的照片 */
        preprocessImg(file, sizeLimitMb || 10, { log: compressLog }).then(
          (compressedFile) => {
            if (crop) {
              handleFileToCrop(compressedFile);
            } else {
              const blob = new Blob([compressedFile], {
                type: compressedFile.type || 'image/jpeg',
              });

              handleFileUpload(blob, fileName.current).then((success) => {
                if (success) {
                  handlePreview(blobToUrl(blob));
                }
              });
            }
          },
        );
      }
    },
    [handleFileToCrop, errors, registerName, crop, sizeLimitMb, compressLog],
  );

  const {
    fileLimitationPrefix = '檔案最大限制：',
    formatPrefix = '影像格式：',
    resolveRecommendedDimension = (
      w: number,
      h: number,
      wR: number,
      hR: number,
    ) => `建議尺寸：${w} x ${h} 以上 (圖像比例為 ${wR}:${hR})`,
    upload: uploadLabel = '上傳',
    error: errorLabel = '上傳錯誤',
    success: successLabel = '完成',
    failed: failedLabel = '失敗',
  } = labels || {};

  const annotationInfos = useMemo(() => {
    if (!annotation) return null;

    const maximumMbText = `${fileLimitationPrefix}${annotation.maximumMb}MB`;
    const format = annotation.formats
      ? `${formatPrefix}${annotation.formats.join(', ')}`
      : null;
    const maximumMb = annotation.maximumMb ? maximumMbText : null;
    const recommendedText =
      annotation?.recommendedText ||
      (() => {
        if (!annotation?.recommendedDimension) return null;

        const [w, h] = annotation.recommendedDimension;
        const gcdNumber = gcd(w, h);
        const wR = w / gcdNumber;
        const hR = h / gcdNumber;
        return resolveRecommendedDimension(w, h, wR, hR);
      })();

    return [
      format,
      recommendedText,
      maximumMb,
      ...(annotation?.others || []),
    ].filter((t) => typeof t === 'string');
  }, [
    annotation,
    fileLimitationPrefix,
    formatPrefix,
    resolveRecommendedDimension,
  ]);

  useDefaultValue(registerName, defaultValue);

  const aspectRatio = (!width || !height) && aspect ? `${aspect}` : undefined;

  return (
    <BaseField
      disabledErrMsg
      fullWidth={width ? undefined : fullWidth}
      className={className}
      disabled={disabled}
      style={{
        aspectRatio,
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
      baseFieldStyle={{ aspectRatio }}
      label={label}
      errors={errors}
      name={registerName}
      required={required}
      remark={remark}
      errorMsgRender={errorMsgRender}
    >
      <div
        ref={rootRef}
        role="button"
        style={cssVars}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        className={cx(
          uploadImageFieldClasses.host,
          (status === 'error' || errors?.[registerName]) &&
            uploadImageFieldClasses.error,
          dragActive && uploadImageFieldClasses.drag,
          small && uploadImageFieldClasses.small,
          previewClassName,
        )}
      >
        <Fade in={!preview}>
          <>
            <Icon
              className={uploadImageFieldClasses.icon}
              color={status === 'error' ? 'error' : icon?.color || 'primary'}
              icon={status === 'error' ? TimesIcon : icon?.icon || UploadIcon}
            />
            {!small && !!text && (
              <Typography
                variant="input2"
                color={status === 'error' ? 'error' : 'primary'}
              >
                {status === 'error' ? errorLabel : text}
              </Typography>
            )}
          </>
        </Fade>

        <Fade in={!!preview}>
          <div
            className={uploadImageFieldClasses.preview}
            style={{ backgroundSize: previewBgSize, color: 'red' }}
          />
        </Fade>

        <Fade in={!!progress}>
          <div role="progressbar" className={uploadImageFieldClasses.progress}>
            {(status === 'success' || status === 'error') && (
              <Fade in>
                <>
                  <Icon
                    className={uploadImageFieldClasses.icon}
                    color={status}
                    icon={status === 'success' ? CheckIcon : TimesIcon}
                  />
                  {!small && (
                    <Typography color={status} variant="input1">
                      {uploadLabel}
                      {status === 'success' ? successLabel : failedLabel}
                    </Typography>
                  )}
                </>
              </Fade>
            )}
          </div>
        </Fade>

        <Fade in={!!preview && hover}>
          <div className={uploadImageFieldClasses.delete}>
            <Icon
              className={uploadImageFieldClasses.icon}
              color={status === 'error' ? 'error' : 'primary'}
              icon={TrashIcon}
            />
          </div>
        </Fade>
      </div>
      <input
        {...registration}
        className={uploadImageFieldClasses.input}
        type="file"
        ref={inputRef}
        accept={acceptExtensions.join(',')}
        onChange={onInputChange}
      />
      <CropperModal
        header={cropperHeader}
        mimeType={mimeType}
        aspect={aspect}
        open={crop && cropperOpen}
        image={imageSrc}
        sizeLimitMb={sizeLimitMb}
        onClose={() => setCropperOpen(false)}
        onComplete={(croppedImg, croppedFile) => {
          handleFileUpload(croppedFile, fileName.current).then((success) => {
            if (success) {
              handlePreview(croppedImg);
            }
          });
        }}
      />
      {!!annotationInfos?.length && (
        <div role="contentinfo" className={uploadImageFieldClasses.annotations}>
          {annotationInfos.map((info, index) => (
            <Typography
              // eslint-disable-next-line react/no-array-index-key
              key={`${index}`}
              color="text-secondary"
              variant="caption"
            >
              {info}
            </Typography>
          ))}
        </div>
      )}
    </BaseField>
  );
};

export default UploadImageField;
