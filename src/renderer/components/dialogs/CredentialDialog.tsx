import { useState, useEffect, useMemo } from 'react';
import { Box, Button, Typography, Divider } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import type { Credential, CredentialFormData, FieldDefinition } from '../../../types';
import { CustomForm, CustomFieldInput } from '../forms';
import FormDialog from './FormDialog';

const emptyForm: CredentialFormData = {
  serviceName: '',
  username: '',
  password: '',
  tags: [],
  note: '',
  customFields: [],
};

interface CredentialDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CredentialFormData) => void;
  initial?: Credential | null;
  allTags: string[];
}

export default function CredentialDialog({
  open,
  onClose,
  onSave,
  initial,
  allTags,
}: CredentialDialogProps) {
  const [form, setForm] = useState<CredentialFormData>({ ...emptyForm });

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              serviceName: initial.serviceName,
              username: initial.username,
              password: initial.password,
              tags: [...initial.tags],
              note: initial.note,
              customFields: [...(initial.customFields || [])],
            }
          : { ...emptyForm },
      );
    }
  }, [open, initial]);

  const handleChange = (field: string, value: unknown) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleAddCustomField = () => {
    setForm((p) => ({
      ...p,
      customFields: [...p.customFields, { key: '', value: '' }],
    }));
  };

  const handleCustomFieldChange = (index: number, field: { key: string; value: string }) => {
    setForm((p) => ({
      ...p,
      customFields: p.customFields.map((f, i) => (i === index ? field : f)),
    }));
  };

  const handleDeleteCustomField = (index: number) => {
    setForm((p) => ({
      ...p,
      customFields: p.customFields.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (!form.serviceName.trim() || !form.username.trim() || !form.password.trim())
      return;
    onSave({ ...form });
    onClose();
  };

  const isValid =
    form.serviceName.trim() &&
    form.username.trim() &&
    form.password.trim();

  const fields: FieldDefinition[] = useMemo(
    () => [
      {
        name: 'serviceName',
        type: 'text' as const,
        label: 'Service Name',
        required: true,
        error: form.serviceName !== '' && !form.serviceName.trim(),
      },
      {
        name: 'username',
        type: 'password' as const,
        label: 'Username',
        required: true,
        error: form.username !== '' && !form.username.trim(),
      },
      {
        name: 'password',
        type: 'password' as const,
        label: 'Password',
        required: true,
        error: form.password !== '' && !form.password.trim(),
      },
      {
        name: 'tags',
        type: 'tags' as const,
        label: 'Tags',
        options: allTags,
      },
      {
        name: 'note',
        type: 'textarea' as const,
        label: 'Note',
        rows: 3,
      },
    ],
    [allTags, form.serviceName, form.username, form.password],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={initial ? 'Edit Credential' : 'Add Credential'}
      submitLabel={initial ? 'Save' : 'Add'}
      submitDisabled={!isValid}
    >
      <CustomForm fields={fields} values={form as any} onChange={handleChange} />

      <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Custom Fields
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddCustomField}
            sx={{ textTransform: 'none' }}
          >
            Add Field
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {form.customFields.map((field, index) => (
            <CustomFieldInput
              key={index}
              field={field}
              onChange={(f) => handleCustomFieldChange(index, f)}
              onDelete={() => handleDeleteCustomField(index)}
            />
          ))}
        </Box>
      </Box>
    </FormDialog>
  );
}

