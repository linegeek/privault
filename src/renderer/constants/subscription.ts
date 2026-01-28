import { Period } from '../../types';

export const PERIOD_OPTIONS: Period[] = [
  '1 week',
  '1 month',
  '3 months',
  '6 months',
  '1 year',
  '2 years',
];

export const SUBSCRIPTION_COLUMN_LABELS: Record<string, string> = {
  no: 'No',
  serviceName: 'Service Name',
  dueDate: 'Due Date',
  amount: 'Amount',
  period: 'Period',
  tags: 'Tags',
  note: 'Note',
  active: 'Active',
};

export const DEFAULT_VISIBILE_SUBSCRIPTION_COLUMNS: string[] = [
  'no',
  'serviceName',
  'dueDate',
  'amount',
  'period',
  'tags',
  'note',
  'active',
];

export const SUBSCRIPTION_COLUMN_VISIBILITY_STORAGE_KEY =
  'column-visibility-subscriptions';
