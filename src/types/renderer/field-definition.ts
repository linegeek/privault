import { TextFieldProps } from '@mui/material';
import { FieldType } from './field-type';

export interface FieldDefinition {
  name: string;
  type: FieldType;
  label: string;
  required?: boolean;
  options?: string[] | readonly string[];
  rows?: number;
  currency?: string;
  InputLabelProps?: TextFieldProps['InputLabelProps'];
  multiline?: boolean;
  [key: string]: unknown;
}

