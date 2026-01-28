import { useState, useEffect, useMemo } from 'react';
import type { Credential, CredentialFormData, FieldDefinition } from '../../../types';
import { CustomForm } from '../forms';
import FormDialog from './FormDialog';

const emptyForm: CredentialFormData = {
  serviceName: '',
  email: '',
  password: '',
  tags: [],
  note: '',
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
              email: initial.email,
              password: initial.password,
              tags: [...initial.tags],
              note: initial.note,
            }
          : { ...emptyForm },
      );
    }
  }, [open, initial]);

  const handleChange = (field: string, value: unknown) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.serviceName.trim() || !form.email.trim() || !form.password.trim())
      return;
    onSave({ ...form });
    onClose();
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isValid =
    form.serviceName.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    isValidEmail;

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
        name: 'email',
        type: 'email' as const,
        label: 'Email',
        required: true,
        error: form.email !== '' && (!form.email.trim() || !isValidEmail),
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
    [allTags, form.serviceName, form.email, form.password, isValidEmail],
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
    </FormDialog>
  );
}

