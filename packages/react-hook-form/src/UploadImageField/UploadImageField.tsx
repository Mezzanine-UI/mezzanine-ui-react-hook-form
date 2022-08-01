/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable react-hooks/exhaustive-deps */
import { CheckIcon, TimesIcon, UploadIcon } from '@mezzanine-ui/icons';
import {
  cx, Fade, Icon,
  IconProps,
  Typography,
} from '@mezzanine-ui/react';
import { CssVarInterpolations } from '@mezzanine-ui/system/css';
import { concat, isString, uniq } from 'lodash';
import {
  ChangeEventHandler, DragEventHandler,
  MouseEventHandler, useCallback, useMemo,
  useRef,
  useState,
} from 'react';
import {
  FieldValues,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { uploadImageFieldClasses } from '@mezzanine-ui/react-hook-form-core';
import { BaseField } from '../BaseField';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import { CropperModal } from '../Mezzanine/CropperModal/CropperModal';
import { UploadStatus } from '../typings/file';
import { useUploadHandlers } from './use-upload-handlers';
import { fileListToArray } from '../utils';

const BASE_ACCEPT_FILE_EXTENSION = ['.jpg', '.jpeg', '.png'];

export type UploadImageFieldProps = HookFormFieldProps<FieldValues, {
  url: string;
  bearerToken?: string;
  acceptFileExtensions?: string[];
  aspect?: number;
  dimensionLimit?: number[];
  sizeLimitMb?: number;
  typeHint?: boolean;
  small?: boolean;
  size?: number;
  width?: number;
  icon?: IconProps;
  text?: string;
  height?: number;
  previewClassName?: string;
  resolve: (response: any) => any;
  annotation?: {
    formats: string[],
    recommendedDimension: [number, number],
    maximumMb: number,
  },
}>;

const UploadImageField: HookFormFieldComponent<UploadImageFieldProps> = ({
  url,
  text = '上傳影像',
  acceptFileExtensions = [],
  aspect,
  previewClassName,
  className,
  control,
  disabled,
  height = 200,
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
  width = 200,
  annotation,
  icon,
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
  });

  const {
    errors,
  } = useFormState({ control: control || contextControl });

  const registration = useMemo(() => (register || contextRegister)(
    registerName,
    {
      required,
      disabled,
    },
  ), [registerName, required, disabled]);

  const [dragActive, setDragActive] = useState(false);
  const [hover, setHover] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(isString(watchValue) ? watchValue : watchValue?.name || '');
  const [preview, setPreview] = useState<string>(isString(watchValue) ? watchValue : watchValue?.name || '');
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<UploadStatus>('ready');
  const [cropperOpen, setCropperOpen] = useState(false);

  const cssVars: CssVarInterpolations = {
    '--backgroundImage': `url("${preview}")`,
    '--progress': `${progress}%`,
    '--width': `${width}px`,
    '--height': `${height}px`,
  };

  const handlePreview = (img: string) => setPreview(img);

  const acceptExtensions = useMemo(() => (
    uniq(
      concat(
        BASE_ACCEPT_FILE_EXTENSION,
        acceptFileExtensions,
      ),
    )
  ), [acceptFileExtensions]);

  const {
    handleFileToCrop,
    handleCroppedFileUpload,
  } = useUploadHandlers({
    url,
    bearerToken,
    fileExtensions: acceptExtensions,
    registerName,
    sizeLimit: sizeLimitMb,
    setCropperOpen,
    setImageSrc,
    setProgress,
    setStatus,
    setValue,
    resolve,
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

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer) {
      const [file] = fileListToArray(e.dataTransfer.files);

      if (file) {
        handleFileToCrop(file);
      }
    }
  }, [handleFileToCrop]);

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
    setValue(registerName, undefined);
  }, []);

  const onClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
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
  }, [handleFileToCrop, status]);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    if (errors?.[registerName]) clearErrors(registerName);

    const target = (e.target as HTMLInputElement);

    if (target.files?.length) {
      const [file] = fileListToArray(target.files);

      if (file) handleFileToCrop(file);
    }
  }, [handleFileToCrop, errors, registerName]);

  const annotationInfo = useMemo(() => {
    if (!annotation) return null;

    const [w, h] = annotation.recommendedDimension;
    const lessOne = Math.min(w, h);
    const wR = Math.round(w / lessOne);
    const hR = Math.round(h / lessOne);
    const recommendedText = `建議尺寸：${w} x ${h} 以上 (圖像比例為 ${wR}:${hR})`;
    const maximumMbText = `檔案最大限制：${annotation.maximumMb}MB`;

    return {
      format: `影像格式：${annotation.formats.join(', ')}`,
      recommendedSize: recommendedText,
      maximumMb: maximumMbText,
    };
  }, [annotation]);

  return (
    <BaseField
      disabledErrMsg
      className={className}
      disabled={disabled}
      style={style}
      label={label}
      errors={errors}
      name={registerName}
      required={required}
      remark={remark}
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
          (status === 'error' || errors?.[registerName]) && uploadImageFieldClasses.error,
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
                {status === 'error' ? '上傳錯誤' : text}
              </Typography>
            )}
          </>
        </Fade>

        <Fade in={!!preview}>
          <div
            className={uploadImageFieldClasses.preview}
          />
        </Fade>

        <Fade in={!!progress}>
          <div role="progressbar" className={uploadImageFieldClasses.progress}>
            {
              (status === 'success' || status === 'error') && (
                <Fade in>
                  <>
                    <Icon
                      className={uploadImageFieldClasses.icon}
                      color={status}
                      icon={status === 'success' ? CheckIcon : TimesIcon}
                    />
                    {!small
                    && (
                      <Typography
                        color={status}
                        variant="input1"
                      >
                        上傳
                        {status === 'success' ? '完成' : '失敗'}
                      </Typography>
                    )}

                  </>
                </Fade>
              )
            }
          </div>
        </Fade>

        <Fade in={!!preview && hover}>
          <div
            className={uploadImageFieldClasses.delete}
          >
            <Icon
              className={uploadImageFieldClasses.icon}
              color="primary"
              icon={TimesIcon}
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
        aspect={aspect}
        open={cropperOpen}
        image={imageSrc}
        sizeLimitMb={sizeLimitMb}
        onClose={() => setCropperOpen(false)}
        onComplete={(croppedImg, croppedFile) => {
          handleCroppedFileUpload(croppedFile).then((success) => {
            if (success) {
              handlePreview(croppedImg);
            }
          });
        }}
      />
      {!!annotationInfo && (
        <div role="contentinfo" className={uploadImageFieldClasses.annotations}>
          <Typography color="text-secondary" variant="caption">
            {annotationInfo.format}
          </Typography>
          <Typography color="text-secondary" variant="caption">
            {annotationInfo.recommendedSize}
          </Typography>
          <Typography color="text-secondary" variant="caption">
            {annotationInfo.maximumMb}
          </Typography>
        </div>
      )}
    </BaseField>
  );
};

export default UploadImageField;