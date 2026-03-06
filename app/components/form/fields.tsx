import { useState } from 'react';
import {
  createCheckboxField,
  createFormField,
  createSelectField,
  createTextareaField,
  createTextField,
  IconButton,
  IconWrapper,
  SelectInput,
  SelectInputProps,
  TextInput,
  TextInputProps,
} from '@hanlogy/react-web-ui';
import { regions } from '@/lib/regions';
import { LockSvg, MailSvg, VisibilityOffSvg, VisibilitySvg } from '../svgs';
import { fieldClassNameBuilders } from './common';

export const TextField = createTextField(fieldClassNameBuilders);

export const TextareaField = createTextareaField(fieldClassNameBuilders);

export const SelectField = createSelectField(fieldClassNameBuilders);

export const CheckboxField = createCheckboxField(fieldClassNameBuilders);

export const PasswordField = createFormField<Omit<TextInputProps, 'type'>>(
  (props) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
      <TextInput
        prefix={
          <IconWrapper size="small">
            <LockSvg />
          </IconWrapper>
        }
        type={isVisible ? 'text' : 'password'}
        suffix={
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible((e) => !e);
            }}
          >
            {isVisible ? <VisibilitySvg /> : <VisibilityOffSvg />}
          </IconButton>
        }
        {...props}
      />
    );
  },
  fieldClassNameBuilders
);

export const EmailField = createFormField<Omit<TextInputProps, 'type'>>(
  (props) => {
    return (
      <TextInput
        prefix={
          <IconWrapper>
            <MailSvg />
          </IconWrapper>
        }
        {...props}
      />
    );
  },
  fieldClassNameBuilders
);

export const RegionSelectField = createFormField<
  Omit<SelectInputProps, 'options'>
>((props) => {
  const options = Object.entries(regions).map(([code, item]) => {
    return {
      value: code,
      label: item.l10n.en,
    };
  });
  return <SelectInput isOptional={true} {...props} options={options} />;
}, fieldClassNameBuilders);
