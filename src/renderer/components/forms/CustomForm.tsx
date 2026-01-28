import { ReactNode } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { FieldDefinition } from '../../../types';
import CurrencyField from './CurrencyField';
import TagsAutocomplete from './TagsAutocomplete';

interface CustomFormProps {
  fields: FieldDefinition[];
  values: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}

export default function CustomForm({
  fields,
  values,
  onChange,
}: CustomFormProps) {
  const renderField = (field: FieldDefinition): ReactNode => {
    const { name, type, label, required, options, rows, currency, ...otherProps } = field;
    const value = values[name];

    switch (type) {
      case 'text':
        return (
          <TextField
            key={name}
            label={label}
            required={required}
            value={(value as string) || ''}
            onChange={(e) => onChange(name, e.target.value)}
            fullWidth
            {...otherProps}
          />
        );

      case 'number':
        return (
          <TextField
            key={name}
            label={label}
            type="number"
            required={required}
            value={(value as string | number) || ''}
            onChange={(e) => onChange(name, e.target.value)}
            fullWidth
            {...otherProps}
          />
        );

      case 'date':
        return (
          <TextField
            key={name}
            label={label}
            type="date"
            required={required}
            value={(value as string) || ''}
            onChange={(e) => onChange(name, e.target.value)}
            InputLabelProps={{ shrink: true, ...field.InputLabelProps }}
            fullWidth
            {...otherProps}
          />
        );

      case 'select':
        return (
          <FormControl key={name} fullWidth {...otherProps}>
            <InputLabel>{label}</InputLabel>
            <Select
              value={(value as string) || ''}
              label={label}
              onChange={(e) => onChange(name, e.target.value)}
            >
              {options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            key={name}
            control={
              <Checkbox
                checked={(value as boolean) || false}
                onChange={(e) => onChange(name, e.target.checked)}
              />
            }
            label={label}
            {...otherProps}
          />
        );

      case 'tags':
        return (
          <TagsAutocomplete
            key={name}
            options={options as string[] || []}
            value={(value as string[]) || []}
            label={label}
            onChange={(_, v) =>
              onChange(
                name,
                v
                  .map((x) => (typeof x === 'string' ? x.trim() : ''))
                  .filter(Boolean),
              )
            }
            {...otherProps}
          />
        );

      case 'currency':
        return (
          <CurrencyField
            key={name}
            label={label}
            value={(value as string) || ''}
            onChange={(e) => onChange(name, e.target.value)}
            currency={currency}
            fullWidth
            {...otherProps}
          />
        );

      case 'textarea':
        return (
          <TextField
            key={name}
            label={label}
            value={(value as string) || ''}
            onChange={(e) => onChange(name, e.target.value)}
            multiline
            rows={rows || 2}
            fullWidth
            {...otherProps}
          />
        );

      default:
        return null;
    }
  };

  return <>{fields.map((field) => renderField(field))}</>;
}

