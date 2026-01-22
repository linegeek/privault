import { TextField, TextFieldProps, InputAdornment } from '@mui/material';

interface CurrencyFieldProps extends Omit<TextFieldProps, 'type'> {
  currency?: string;
}

export default function CurrencyField({
  currency = '$',
  ...props
}: CurrencyFieldProps) {
  return (
    <TextField
      type="number"
      {...props}
      InputProps={{
        ...props.InputProps,
        startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
      }}
    />
  );
}
