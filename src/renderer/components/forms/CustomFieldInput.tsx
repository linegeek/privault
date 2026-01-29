import { useState } from 'react';
import { Box, TextField, IconButton, InputAdornment } from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

interface CustomFieldInputProps {
  field: { key: string; value: string };
  onChange: (field: { key: string; value: string }) => void;
  onDelete: () => void;
}

export default function CustomFieldInput({
  field,
  onChange,
  onDelete,
}: CustomFieldInputProps) {
  const [showValue, setShowValue] = useState(false);

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <TextField
        size="small"
        label="Field Name"
        value={field.key}
        onChange={(e) => onChange({ ...field, key: e.target.value })}
        sx={{ flex: 1 }}
      />
      <TextField
        size="small"
        label="Field Value"
        type={showValue ? 'text' : 'password'}
        value={field.value}
        onChange={(e) => onChange({ ...field, value: e.target.value })}
        sx={{ flex: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowValue(!showValue)}
                edge="end"
                size="small"
              >
                {showValue ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <IconButton
        onClick={onDelete}
        size="small"
        sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}

