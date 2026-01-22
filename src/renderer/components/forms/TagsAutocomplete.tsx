import { Autocomplete, TextField, Chip, AutocompleteProps } from '@mui/material';

interface TagsAutocompleteProps
  extends Omit<
    AutocompleteProps<string, true, false, true>,
    'options' | 'renderInput' | 'renderTags'
  > {
  options: string[];
  label?: string;
  size?: 'small' | 'medium';
}

export default function TagsAutocomplete({
  options,
  label = 'Tags',
  size = 'medium',
  ...props
}: TagsAutocompleteProps) {
  return (
    <Autocomplete
      multiple
      freeSolo
      options={options}
      size={size}
      {...props}
      renderInput={(params) => <TextField {...params} label={label} />}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip label={option} {...getTagProps({ index })} size="small" />
        ))
      }
    />
  );
}
