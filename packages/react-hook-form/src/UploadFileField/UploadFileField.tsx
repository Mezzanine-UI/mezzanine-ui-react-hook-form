/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-param-reassign */
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
import UploadResult, { _UploadResultProps } from './_UploadResult';

export type UploadFileDefaultInput = { name: string, url: string };

function isUploadFileDefaultInput(value: any): value is UploadFileDefaultInput { return typeof value?.name === 'string' && typeof value?.url === 'string'; }

export type UploadFileDefault = UploadFileDefaultInput | string | File;

export type UploadFileOptions<T> = {
  url: string;
  bearerToken?: string;
  small?: boolean;
  formDataName?: string;
  formDataFileName?: string;
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
  upload?: _UploadResultProps['upload'];
} & T;

export type UploadFileFieldProps<
  Default extends UploadFileDefault = UploadFileDefault,
  DefaultValue extends Default | undefined = Default | undefined> = HookFormFieldProps<FieldValues, Omit<UploadResultProps, 'status' | 'name' | 'defaultValue'>, UploadFileOptions<{
    /**
    * `src` or `file`
    */
    defaultValue?: DefaultValue[];
    defaultResolve?: (data: DefaultValue, originFile: File) => any;
  }> & DefaultValue extends undefined ? UploadFileOptions<{
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
  formDataFileName = 'fileName',
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
  upload,
  ...props
}: UploadFileFieldProps<any, any>): JSX.Element {
  const { formState, setValue } = useFormContext();
  const currentKey = useRef(-1);
  const initialValue = useRef(defaultValue?.map((file) => {
    currentKey.current += 1;

    const _v = (() => {
      if (file instanceof File) return { key: currentKey.current, file };
      if (typeof file === 'string') return { key: currentKey.current, file: srcToFile(file, file) };

      if (isUploadFileDefaultInput(file)) {
        return { key: currentKey.current, file: srcToFile(file.url, file.name) };
      }

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
    const init = initialValue.current?.reduce((total, f) => {
      if (!f) return total;

      const fileName = (fileRegisterName?.(f?.file.file, f.file.key) || f?.file.file.name).replaceAll('.', '-') || '';
      total[fileName] = f?.resolvedValue;

      return total;
    }, {} as any);

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
            formDataFileName={formDataFileName}
            bearerToken={bearerToken}
            file={file.file}
            accept={uploadButton?.accept}
            disabledUpload={initialValueMap.has(file.key)}
            registerName={`${registerName}.${(fileRegisterName?.(file.file, file.key) || file.file.name).replaceAll('.', '-')}`}
            onDelete={() => onDelete(file.file)}
            upload={upload}
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
