/* eslint-disable no-redeclare */
import {
  Option,
  OptionGroup,
  Select,
  SelectValue,
} from '@mezzanine-ui/react';
import { selectFieldClasses } from '@mezzanine-ui/react-hook-form-core';
import { SelectMultipleProps, SelectProps, SelectSingleProps } from '@mezzanine-ui/react/Select/Select';
import { ReactNode, useEffect } from 'react';
import {
  FieldValues,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import BaseField from '../BaseField/BaseField';
import { HookFormFieldComponent, HookFormFieldProps } from '../typings/field';
import { OptionItemGroupsType, OptionItemsType } from '../typings/option';

type CustomSelectFieldProps = {
  optionGroups?: OptionItemGroupsType;
  width?: number;
  options?: OptionItemsType;
};

export type SelectSingleFieldProps = HookFormFieldProps<FieldValues, SelectSingleProps, CustomSelectFieldProps>;

export type SelectMultiFieldProps = HookFormFieldProps<FieldValues, SelectMultipleProps, CustomSelectFieldProps>;

export type SelectFieldProps = HookFormFieldProps<FieldValues, SelectProps, CustomSelectFieldProps>;

function SelectField(props: SelectSingleFieldProps): ReactNode;
function SelectField(props: SelectMultiFieldProps): ReactNode;
function SelectField(props: SelectFieldProps): ReactNode {
  const {
    className,
    clearable = false,
    defaultValue,
    disabled,
    fullWidth,
    width,
    inputMode,
    itemScope = false,
    label,
    mode,
    itemsInView,
    optionGroups,
    options,
    placeholder = '請選擇',
    popperOptions,
    registerName,
    remark,
    renderValue,
    required,
    role,
    size,
    style,
    errorMsgRender,
    ...restProps
  } = props || {};

  const {
    clearErrors,
    formState: { errors },
    control,
    resetField,
    setValue,
  } = useFormContext();

  const watchValue = useWatch({
    control,
    name: registerName as string,
    defaultValue,
  }) || defaultValue;

  const onClear = () => {
    resetField(registerName);
    setValue(registerName, undefined);
  };

  const onChange = (newValue: SelectValue) => {
    if (errors?.[registerName]) clearErrors(registerName);

    setValue(
      registerName,
      newValue,
    );
  };

  useEffect(() => {
    if (defaultValue) {
      setValue(registerName, defaultValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseField
      disabled={disabled}
      name={registerName}
      style={style}
      label={label}
      remark={remark}
      required={required}
      className={className}
      width={width}
      errors={errors}
      errorMsgRender={errorMsgRender}
    >
      <Select
        {...restProps}
        role={role}
        inputMode={inputMode}
        itemScope={itemScope}
        fullWidth={fullWidth}
        clearable={clearable}
        itemsInView={itemsInView}
        mode={mode as any}
        onClear={onClear}
        onChange={onChange}
        placeholder={placeholder}
        popperOptions={popperOptions}
        renderValue={renderValue}
        required={required}
        size={size}
        value={watchValue}
        className={selectFieldClasses.fill}
      >
        {optionGroups?.map((optionGroup) => (
          <OptionGroup
            key={optionGroup.label}
            label={optionGroup.label}
          >
            {optionGroup.options.map((option) => (
              <Option
                key={option.id}
                value={option.id}
              >
                {option.name}
              </Option>
            ))}
          </OptionGroup>
        ))}
        {options?.map((option) => (
          <Option
            key={option.id}
            value={option.id}
          >
            {option.name}
          </Option>
        ))}
      </Select>
    </BaseField>
  );
}

export default SelectField as HookFormFieldComponent<SelectFieldProps>;
