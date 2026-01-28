import { useState, useEffect, useMemo } from 'react';
import type {
  Subscription,
  SubscriptionFormData,
  FieldDefinition,
} from '../../../types';
import { PERIOD_OPTIONS } from '../../constants';
import { CustomForm } from '../forms';
import FormDialog from './FormDialog';

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

  const fields: FieldDefinition[] = useMemo(
    () => [
      {
        name: 'serviceName',
        type: 'text' as const,
        label: 'Service Name',
        required: true,
      },
      {
        name: 'dueDate',
        type: 'date' as const,
        label: 'Due Date',
        required: true,
        InputLabelProps: { shrink: true },
      },
      {
        name: 'amount',
        type: 'currency' as const,
        label: 'Amount',
      },
      {
        name: 'period',
        type: 'select' as const,
        label: 'Period',
        options: PERIOD_OPTIONS,
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
        rows: 2,
      },
      {
        name: 'active',
        type: 'checkbox' as const,
        label: 'Active',
      },
    ],
    [allTags],
  );

  const handleChange = (field: string, value: unknown) => {
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
      <CustomForm fields={fields} values={form as any} onChange={handleChange} />
    </FormDialog>
  );
}
