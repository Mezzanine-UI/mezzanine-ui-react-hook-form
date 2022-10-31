/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Typography, UploadButton, UploadButtonProps, UploadResultProps,
} from '@mezzanine-ui/react';
import { isNil, isString } from 'lodash';
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { BaseField } from '../BaseField';
import { HookFormFieldProps } from '../typings/field';
import { UseUploadHandlersProps } from '../UploadImageField';
import { srcToFile } from '../utils';
import UploadResult from './_UploadResult';

export type UploadFileDefaultInput = { name: string, url: string };

export type UploadFileDefault = UploadFileDefaultInput | string | File;

export type UploadFileOptions<T> = {
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
  hideUploadResults?: boolean;
  /**
   * `src` or `file`
   */
  fileRegisterName?: (file: File, virtualDomKey?: number) => string;
  resolve: UseUploadHandlersProps['resolve'];
} & T;

export type UploadFileFieldProps<
  Default extends UploadFileDefault = UploadFileDefaultInput | string | File,
  DefaultValue extends Default | undefined = Default | undefined> = HookFormFieldProps<FieldValues, Omit<UploadResultProps, 'status' | 'name' | 'defaultValue'>, {
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
    hideUploadResults?: boolean;
    /**
   * `src` or `file`
   */
    defaultValue?: DefaultValue[];
    defaultResolve?: (data: DefaultValue, originFile: File) => any;
    fileRegisterName?: (file: File, virtualDomKey?: number) => string;
    resolve: UseUploadHandlersProps['resolve'];
  // eslint-disable-next-line @typescript-eslint/ban-types
  } & DefaultValue extends undefined ? UploadFileOptions<{
      defaultValue?: DefaultValue[];
      defaultResolve?: (data: DefaultValue, originFile: File) => any;
    }> : UploadFileOptions<{
      defaultValue: DefaultValue[];
      defaultResolve: (data: DefaultValue, originFile: File) => any,
    }>>;

export type UploadFile = {
  key: number;
  file: File;
};

export function UploadFileField<D extends UploadFileDefault>(props: UploadFileFieldProps<D, D>): JSX.Element;
export function UploadFileField(props: UploadFileFieldProps<string, string>): JSX.Element;
export function UploadFileField(props: UploadFileFieldProps<File, File>): JSX.Element;
export function UploadFileField(props: UploadFileFieldProps<UploadFileDefaultInput, UploadFileDefaultInput>): JSX.Element;
export function UploadFileField<D extends UploadFileDefault>(props: UploadFileFieldProps<D, undefined>): JSX.Element;
export function UploadFileField({
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
  hideUploadResults = false,
  label,
  defaultValue,
  fileRegisterName,
  errorMsgRender,
  defaultResolve,
  ...props
}: UploadFileFieldProps<any, any>): JSX.Element {
  const { formState, setValue } = useFormContext();
  const currentKey = useRef(0);
  const initialValue = useRef(defaultValue?.map((file) => {
    const _v = (() => {
      if (file instanceof File) return { key: currentKey.current, file };
      if (typeof file === 'string') return { key: currentKey.current, file: srcToFile(file, file) };

      const fileAny: any = file;

      if (fileAny) {
        return { key: currentKey.current, file: srcToFile(fileAny.url, fileAny.name) };
      }

      currentKey.current += 1;

      return undefined;
    })();

    return _v ? { file: _v, resolvedValue: defaultResolve?.(file, _v?.file) } : undefined;
  }));
  const initialValueMap = useMemo(() => new Map(initialValue.current?.map((v) => [v?.file.key, v])), []);
  const [files, setFiles] = useState<(UploadFile | undefined)[]>([...(initialValue.current?.map((v) => v?.file) || [])]);

  const onUpload = useCallback(
    async (fs: File[]) => {
      setFiles((prev) => [...prev, ...fs.map((file) => {
        currentKey.current += 1;

        return { key: currentKey.current, file };
      })]);
    },
    [setFiles],
  );

  const onDelete = useCallback((file: File) => {
    setFiles((prev) => prev.filter((f) => f?.file !== file));
  }, [setFiles]);

  const isEmpty = files.length === 0;

  useEffect(() => {
    const init = initialValue.current?.map((f) => f?.resolvedValue);

    if (init) setValue(registerName, init);
  }, []);

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
          style={{
            ...uploadButton?.style,
            marginBottom: hideUploadButtonAsUploaded ? uploadButton?.style?.marginBottom : '16px',
          }}
          type="button"
          onUpload={onUpload}
        >
          {uploadButtonLabel}
        </UploadButton>
      )}
      {files.map((file, index) => (
        !!file && (
          <UploadResult
            {...props}
            hide={hideUploadResults}
            size={size}
            key={file.key}
            resolve={resolve}
            url={url}
            name={file.file.name}
            formDataName={formDataName}
            bearerToken={bearerToken}
            file={file.file}
            disabledUpload={initialValueMap.has(file.key)}
            registerName={`${registerName}.${fileRegisterName?.(file.file, file.key) || file.file.name.replaceAll('.', '-')}`}
            onDelete={() => onDelete(file.file)}
            style={{
              marginTop: index ? `${gap}px` : props.style?.marginTop,
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
}

// export default UploadFileField as HookFormFieldComponent<UploadFileFieldProps<UploadFileDefaultInput, any>>;
