import { useState, useEffect } from 'react';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { Subscription, Period } from '../../../types/common/subscription';
import { PERIOD_OPTIONS } from '../../constants/subscription';
import { CurrencyField, TagsAutocomplete } from '../../components';
import FormDialog from './FormDialog';
import { SubscriptionFormData } from '../../../types/renderer/subscription-form-data';

const emptyForm: SubscriptionFormData = {
  serviceName: '',
  dueDate: '',
  amount: '',
  period: '1 month',
  tags: [],
  note: '',
  active: true,
};

interface SubscriptionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SubscriptionFormData) => void;
  initial?: Subscription | null;
  allTags: string[];
}

export default function SubscriptionDialog({
  open,
  onClose,
  onSave,
  initial,
  allTags,
}: SubscriptionDialogProps) {
  const [form, setForm] = useState<SubscriptionFormData>({ ...emptyForm });

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              serviceName: initial.serviceName,
              dueDate: initial.dueDate,
              amount: String(initial.amount),
              period: initial.period,
              tags: [...initial.tags],
              note: initial.note,
              active: initial.active,
            }
          : { ...emptyForm },
      );
    }
  }, [open, initial]);

  const handleChange = (field: keyof SubscriptionFormData, value: unknown) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.serviceName.trim() || !form.dueDate) return;
    onSave({ ...form });
    onClose();
  };

  const isValid = form.serviceName.trim() !== '' && form.dueDate !== '';

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={initial ? 'Edit Subscription' : 'Add Subscription'}
      submitLabel={initial ? 'Save' : 'Add'}
      submitDisabled={!isValid}
    >
      <TextField
        label="Service Name"
        required
        value={form.serviceName}
        onChange={(e) => handleChange('serviceName', e.target.value)}
      />
      <TextField
        label="Due Date"
        type="date"
        required
        value={form.dueDate}
        onChange={(e) => handleChange('dueDate', e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <CurrencyField
        label="Amount"
        value={form.amount}
        onChange={(e) => handleChange('amount', e.target.value)}
      />
      <FormControl fullWidth>
        <InputLabel>Period</InputLabel>
        <Select
          value={form.period}
          label="Period"
          onChange={(e) => handleChange('period', e.target.value as Period)}
        >
          {PERIOD_OPTIONS.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TagsAutocomplete
        options={allTags}
        value={form.tags}
        onChange={(_, v) =>
          handleChange(
            'tags',
            v
              .map((x) => (typeof x === 'string' ? x.trim() : ''))
              .filter(Boolean),
          )
        }
      />
      <TextField
        label="Note"
        value={form.note}
        onChange={(e) => handleChange('note', e.target.value)}
        multiline
        rows={2}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={form.active}
            onChange={(e) => handleChange('active', e.target.checked)}
          />
        }
        label="Active"
      />
    </FormDialog>
  );
}
